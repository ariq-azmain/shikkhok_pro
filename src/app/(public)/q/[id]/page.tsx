// src/app/(public)/q/[id]/page.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Clock, Award, Eye,
  BookOpen, Cpu, AlertCircle, Loader2,
} from "lucide-react";
import QuestionRenderer from "@/components/question/QuestionRenderer";
import ReactionBar from "@/components/question/ReactionBar";
import CommentSection from "@/components/question/CommentSection";
import type { Question } from "@/types/question";

const DIFFICULTY_CONFIG = {
  EASY: { label: "Easy", className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  NORMAL: { label: "Normal", className: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  HARD: { label: "Hard", className: "text-red-400 bg-red-400/10 border-red-400/20" },
};

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

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentOpen, setCommentOpen] = useState(false);
  const commentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/questions/${id}`)
      .then(async (res) => {
        const text = await res.text();
        const json = text ? JSON.parse(text) : {};
        if (!res.ok) throw new Error(json.error || "Not found");
        setQuestion(json.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // URL hash এ #comments থাকলে auto-open করো
    if (window.location.hash === "#comments") {
      setCommentOpen(true);
    }
  }, [id]);

  function handleCommentToggle() {
    setCommentOpen((v) => !v);
    if (!commentOpen) {
      setTimeout(() => commentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <Loader2 size={28} className="animate-spin text-indigo-400" />
      </main>
    );
  }

  if (error || !question) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "var(--bg-primary)" }}>
        <AlertCircle size={40} className="text-red-400" />
        <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>{error ?? "Question not found"}</p>
        <Link href="/q" className="text-sm text-indigo-400 hover:underline">← Back to Feed</Link>
      </main>
    );
  }

  const difficulty = DIFFICULTY_CONFIG[question.difficulty];
  const totalQs = question.content.sections?.reduce((acc, s) => acc + s.questions.length, 0) ?? 0;

  return (
    <main className="relative min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(99,102,241,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        {/* Back */}
        <Link href="/q" className="inline-flex items-center gap-2 text-sm mb-6 transition-colors hover:text-indigo-400" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={15} /> Back to Feed
        </Link>

        {/* Question card */}
        <article className="rounded-2xl border border-white/5 overflow-hidden mb-4" style={{ background: "var(--bg-card)" }}>
          <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500" />

          <div className="p-6">
            {/* Creator */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 bg-indigo-500/20 border border-indigo-500/30 overflow-hidden">
                {question.creator.avatar ? (
                  <img src={question.creator.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(question.creator.displayName)
                )}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {question.creator.displayName}
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  @{question.creator.username} · {timeAgo(question.createdAt)}
                </p>
              </div>
              {question.aiGenerated && (
                <span className="ml-auto flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-purple-400 bg-purple-400/10 border border-purple-400/20">
                  <Cpu size={10} /> AI Generated
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-xl font-extrabold leading-snug mb-4" style={{ color: "var(--text-primary)" }}>
              {question.title}
            </h1>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="text-xs font-semibold px-3 py-1 rounded-full text-indigo-400 bg-indigo-400/10">
                {question.subject}
              </span>
              <span className="text-xs px-3 py-1 rounded-full text-slate-400 bg-white/5">{question.className}</span>
              {question.chapter && <span className="text-xs px-3 py-1 rounded-full text-slate-400 bg-white/5">{question.chapter}</span>}
              {question.topic && <span className="text-xs px-3 py-1 rounded-full text-slate-400 bg-white/5">{question.topic}</span>}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficulty.className}`}>{difficulty.label}</span>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl mb-6" style={{ background: "var(--bg-secondary)" }}>
              {[
                { icon: Award, label: "Total Marks", value: question.totalMarks ? `${question.totalMarks}` : "—" },
                { icon: Clock, label: "Duration", value: question.timeMinutes ? `${question.timeMinutes} min` : "—" },
                { icon: BookOpen, label: "Questions", value: `${totalQs}` },
                { icon: Eye, label: "Views", value: `${question.viewsCount}` },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center">
                  <Icon size={16} className="mx-auto mb-1 text-indigo-400" />
                  <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>{label}</p>
                </div>
              ))}
            </div>

            <div className="h-px bg-white/5 mb-6" />

            {/* Question content */}
            <QuestionRenderer content={question.content} />
          </div>

          {/* Reaction bar */}
          <div className="px-6 py-3 border-t border-white/5" style={{ background: "var(--bg-secondary)" }}>
            <ReactionBar
              questionId={question.id}
              initialLikes={question.likesCount}
              initialComments={question.commentsCount}
              initialShares={question.sharesCount}
              showCommentToggle
              commentOpen={commentOpen}
              onCommentClick={handleCommentToggle}
            />
          </div>
        </article>

        {/* Comment section */}
        {commentOpen && (
          <div
            ref={commentRef}
            id="comments"
            className="rounded-2xl border border-white/5 p-5"
            style={{ background: "var(--bg-card)" }}
          >
            <CommentSection questionId={question.id} />
          </div>
        )}
      </div>
    </main>
  );
}
