// src/components/question/ReactionBar.tsx
"use client";

import { Heart, MessageSquare, Share2 } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useLike, useShare } from "@/hooks/useReactions";

interface Props {
    questionId: string;
    initialLikes: number;
    initialComments: number;
    initialShares: number;
    onCommentClick?: () => void;
    showCommentToggle?: boolean;
    commentOpen?: boolean;
}

export default function ReactionBar({ questionId, initialLikes, initialComments, initialShares, onCommentClick, showCommentToggle, commentOpen }: Props) {
    const { isSignedIn } = useUser();
    const { liked, count: likeCount, toggle } = useLike(questionId, initialLikes);
    const { count: shareCount, share } = useShare(questionId, initialShares);

    return (
        <div className="flex items-center gap-1">
            {/* Like */}
            <button
                onClick={e => { e.preventDefault(); toggle(); }}
                title={isSignedIn ? undefined : "Sign in to like"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${liked ? "text-rose-400 bg-rose-400/10" : "hover:bg-muted-05"}`}
                style={{ color: liked ? undefined : "var(--text-muted)" }}
            >
                <Heart size={15} className={liked ? "fill-rose-400 text-rose-400" : ""} />
                <span>{likeCount}</span>
            </button>

            {/* Comment */}
            <button
                onClick={e => { e.preventDefault(); onCommentClick?.(); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${showCommentToggle && commentOpen ? "text-indigo-400 bg-indigo-400/10" : "hover:bg-muted-05"}`}
                style={{ color: showCommentToggle && commentOpen ? undefined : "var(--text-muted)" }}
            >
                <MessageSquare size={15} />
                <span>{initialComments}</span>
            </button>

            {/* Share */}
            <button
                onClick={e => { e.preventDefault(); share(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 hover:bg-muted-05"
                style={{ color: "var(--text-muted)" }}
            >
                <Share2 size={15} />
                <span>{shareCount}</span>
            </button>
        </div>
    );
}
