// src/components/question/CommentSection.tsx
"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Send, Trash2, CornerDownRight, Loader2 } from "lucide-react";
import { useComments, type Comment } from "@/hooks/useReactions";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ——— Single comment item ———
interface CommentItemProps {
  comment: Comment;
  questionId: string;
  currentUserId?: string;
  onDelete: (id: string, parentId?: string) => void;
  onReply: (comment: Comment) => void;
  depth?: number;
}

function CommentItem({ comment, currentUserId, onDelete, onReply, depth = 0 }: CommentItemProps) {
  return (
    <div className={`flex gap-2.5 ${depth > 0 ? "pl-8" : ""}`}>
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white overflow-hidden bg-indigo-500/20 border border-indigo-500/20"
      >
        {comment.user.avatar ? (
          <img src={comment.user.avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          getInitials(comment.user.displayName)
        )}
      </div>

      <div className="flex-1 min-w-0">
        {/* Bubble */}
        <div className="rounded-xl px-3 py-2" style={{ background: "var(--bg-secondary)" }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
              {comment.user.displayName}
            </span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              @{comment.user.username}
            </span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {comment.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-1 pl-1">
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>
            {timeAgo(comment.createdAt)}
          </span>
          {depth === 0 && (
            <button
              onClick={() => onReply(comment)}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <CornerDownRight size={11} /> Reply
            </button>
          )}
          {currentUserId === comment.user.id && (
            <button
              onClick={() => onDelete(comment.id, comment.parentId ?? undefined)}
              className="text-xs text-red-400/60 hover:text-red-400 transition-colors"
            >
              <Trash2 size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ——— Replies loader ———
function RepliesSection({
  questionId,
  parentComment,
  currentUserId,
  onDelete,
}: {
  questionId: string;
  parentComment: Comment;
  currentUserId?: string;
  onDelete: (id: string, parentId?: string) => void;
}) {
  const [replies, setReplies] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  async function loadReplies() {
    if (loaded) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/questions/${questionId}/comments?parentId=${parentComment.id}`
      );
      const data = await res.json();
      if (res.ok) setReplies(data.data);
      setLoaded(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pl-8 mt-1.5 space-y-2">
      {!loaded && (
        <button
          onClick={loadReplies}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
        >
          {loading ? <Loader2 size={11} className="animate-spin" /> : <CornerDownRight size={11} />}
          View replies
        </button>
      )}
      {replies.map((r) => (
        <CommentItem
          key={r.id}
          comment={r}
          questionId={questionId}
          currentUserId={currentUserId}
          onDelete={onDelete}
          onReply={() => {}}
          depth={1}
        />
      ))}
    </div>
  );
}

// ——— Input box ———
interface InputProps {
  onSubmit: (content: string) => Promise<void>;
  posting: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}

function CommentInput({ onSubmit, posting, placeholder = "Write a comment...", autoFocus, onCancel }: InputProps) {
  const [value, setValue] = useState("");

  async function handleSubmit() {
    if (!value.trim() || posting) return;
    await onSubmit(value.trim());
    setValue("");
  }

  return (
    <div className="flex gap-2 items-end">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={2}
        maxLength={1000}
        className="flex-1 rounded-xl px-3 py-2 text-sm resize-none outline-none transition-all focus:ring-1 focus:ring-indigo-500"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-primary)",
        }}
      />
      <div className="flex flex-col gap-1">
        <button
          onClick={handleSubmit}
          disabled={!value.trim() || posting}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {posting ? (
            <Loader2 size={15} className="animate-spin text-white" />
          ) : (
            <Send size={15} className="text-white" />
          )}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

// ——— Main CommentSection ———
interface Props {
  questionId: string;
}

export default function CommentSection({ questionId }: Props) {
  const { user: clerkUser, isSignedIn } = useUser();
  const { comments, loading, posting, error, postComment, deleteComment } = useComments(questionId);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);

  // DB user id — comment owner check এর জন্য username দিয়ে করো
  const currentUsername = clerkUser?.username ?? clerkUser?.id;

  async function handleComment(content: string) {
    await postComment(content);
  }

  async function handleReply(content: string) {
    if (!replyingTo) return;
    const newReply = await postComment(content, replyingTo.id);
    if (newReply) setReplyingTo(null);
  }

  return (
    <div>
      <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-secondary)" }}>
        Comments {comments.length > 0 && `(${comments.length})`}
      </h3>

      {/* New comment input */}
      {isSignedIn ? (
        <div className="mb-5">
          <CommentInput onSubmit={handleComment} posting={posting} />
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      ) : (
        <p className="text-sm mb-5 text-center py-3 rounded-xl" style={{ color: "var(--text-muted)", background: "var(--bg-secondary)" }}>
          <a href="/sign-in" className="text-indigo-400 hover:underline">Sign in</a> to comment
        </p>
      )}

      {/* Comment list */}
      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="animate-spin text-indigo-400" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm py-6" style={{ color: "var(--text-muted)" }}>
          No comments yet. Be the first!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                questionId={questionId}
                currentUserId={currentUsername}
                onDelete={deleteComment}
                onReply={setReplyingTo}
              />

              {/* Reply input */}
              {replyingTo?.id === comment.id && (
                <div className="pl-8 mt-2">
                  <CommentInput
                    onSubmit={handleReply}
                    posting={posting}
                    placeholder={`Reply to ${replyingTo.user.displayName}...`}
                    autoFocus
                    onCancel={() => setReplyingTo(null)}
                  />
                </div>
              )}

              {/* Replies */}
              <RepliesSection
                questionId={questionId}
                parentComment={comment}
                currentUserId={currentUsername}
                onDelete={deleteComment}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
