// src/components/question/QuestionCard.tsx
"use client";

import Link from "next/link";
import { BookOpen, Clock, Award, Eye, Heart, MessageSquare, Cpu, ChevronRight } from "lucide-react";
import type { Question } from "@/types/question";

const DIFFICULTY_CONFIG = {
  EASY: { label: "Easy", className: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
  NORMAL: { label: "Normal", className: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  HARD: { label: "Hard", className: "text-red-400 bg-red-400/10 border-red-400/20" },
};

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "text-indigo-400 bg-indigo-400/10",
  Physics: "text-cyan-400 bg-cyan-400/10",
  Chemistry: "text-purple-400 bg-purple-400/10",
  Biology: "text-emerald-400 bg-emerald-400/10",
  Science: "text-teal-400 bg-teal-400/10",
  English: "text-rose-400 bg-rose-400/10",
  Bangla: "text-orange-400 bg-orange-400/10",
  ICT: "text-sky-400 bg-sky-400/10",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

interface Props {
  question: Question;
}

export default function QuestionCard({ question }: Props) {
  const difficulty = DIFFICULTY_CONFIG[question.difficulty];
  const subjectColor = SUBJECT_COLORS[question.subject] ?? "text-slate-400 bg-slate-400/10";
  const totalQs = question.content.sections?.reduce((acc, s) => acc + s.questions.length, 0) ?? 0;

  return (
    <Link href={`/q/${question.id}`} className="block group">
      <article
        className="rounded-2xl p-5 border border-white/5 transition-all duration-200 group-hover:border-white/10 group-hover:-translate-y-0.5 group-hover:shadow-xl"
        style={{ background: "var(--bg-card)" }}
      >
        {/* Header: creator + time */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 bg-indigo-500/20 border border-indigo-500/30">
            {question.creator.avatar ? (
              <img src={question.creator.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(question.creator.displayName)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
              {question.creator.displayName}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {timeAgo(question.createdAt)}
            </p>
          </div>
          {question.aiGenerated && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full text-purple-400 bg-purple-400/10 border border-purple-400/20">
              <Cpu size={10} /> AI
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="font-bold text-base leading-snug mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors"
          style={{ color: "var(--text-primary)" }}
        >
          {question.title}
        </h3>

        {/* Tags row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${subjectColor}`}>
            {question.subject}
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-full text-slate-400 bg-white/5">
            {question.className}
          </span>
          {question.topic && (
            <span className="text-xs px-2.5 py-0.5 rounded-full text-slate-400 bg-white/5">
              {question.topic}
            </span>
          )}
          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${difficulty.className}`}>
            {difficulty.label}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          {question.totalMarks && (
            <span className="flex items-center gap-1">
              <Award size={12} /> {question.totalMarks} marks
            </span>
          )}
          {question.timeMinutes && (
            <span className="flex items-center gap-1">
              <Clock size={12} /> {question.timeMinutes} min
            </span>
          )}
          <span className="flex items-center gap-1">
            <BookOpen size={12} /> {totalQs} questions
          </span>
        </div>

        {/* Footer: stats + CTA */}
        <div
          className="flex items-center justify-between pt-3 border-t border-white/5"
        >
          <div className="flex items-center gap-4 text-xs" style={{ color: "var(--text-muted)" }}>
            <span className="flex items-center gap-1">
              <Heart size={12} /> {question.likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={12} /> {question.commentsCount}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={12} /> {question.viewsCount}
            </span>
          </div>
          <span className="flex items-center gap-0.5 text-xs font-semibold text-indigo-400 group-hover:gap-1.5 transition-all">
            View <ChevronRight size={13} />
          </span>
        </div>
      </article>
    </Link>
  );
}
