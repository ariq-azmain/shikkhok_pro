// src/components/profile/ProfileQuestions.tsx
// ---------------------------------------------------------------
// Grid of public questions for a profile tab.
// Cursor-based infinite scroll.
// ---------------------------------------------------------------
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  HiHeart,
  HiChatBubbleOvalLeft,
  HiEye,
  HiDocumentText,
} from "react-icons/hi2";
import type { Question, Difficulty } from "@/types";
import { cn } from "@/lib/utils";

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  EASY: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  NORMAL: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  HARD: "text-red-400 bg-red-500/10 border-red-500/20",
};

interface ProfileQuestionsProps {
  username: string;
  empty?: React.ReactNode;
}

export function ProfileQuestions({ username, empty }: ProfileQuestionsProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchPage = useCallback(
    async (cursor?: string) => {
      const url = `/api/profile/${encodeURIComponent(username)}/questions${
        cursor ? `?cursor=${cursor}` : ""
      }`;
      const res = await fetch(url);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Failed to load questions");
      }
      return res.json() as Promise<{ data: Question[]; nextCursor: string | null }>;
    },
    [username]
  );

  // Initial load
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchPage()
      .then(({ data, nextCursor }) => {
        setQuestions(data);
        setNextCursor(nextCursor);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [fetchPage]);

  // Load more on sentinel intersection
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !nextCursor) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextCursor && !loadingMore) {
          setLoadingMore(true);
          fetchPage(nextCursor)
            .then(({ data, nextCursor: nc }) => {
              setQuestions((prev) => [...prev, ...data]);
              setNextCursor(nc);
            })
            .catch((e) => setError(e.message))
            .finally(() => setLoadingMore(false));
        }
      },
      { threshold: 0.1 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [nextCursor, loadingMore, fetchPage]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-36 rounded-2xl bg-white/4 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-400 text-sm text-center py-8">{error}</p>
    );
  }

  if (questions.length === 0) {
    return (
      <>{empty ?? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <HiDocumentText size={40} className="text-gray-700" />
          <p className="text-gray-500 text-sm">No public questions yet.</p>
        </div>
      )}</>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((q) => (
          <Link
            key={q.id}
            href={`/q/${q.id}`}
            className="group flex flex-col gap-3 p-4 rounded-2xl bg-white/4 border border-white/5 hover:border-indigo-500/25 hover:bg-white/6 transition-all duration-200"
          >
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                {q.subject}
              </span>
              <span className="text-xs text-gray-500">{q.className}</span>
              <span
                className={cn(
                  "ml-auto text-xs font-medium px-2 py-0.5 rounded-full border",
                  DIFFICULTY_COLOR[q.difficulty]
                )}
              >
                {q.difficulty.charAt(0) + q.difficulty.slice(1).toLowerCase()}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-indigo-200 transition-colors">
              {q.title}
            </h3>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-1">
              <span className="flex items-center gap-1">
                <HiHeart size={13} /> {q.likesCount}
              </span>
              <span className="flex items-center gap-1">
                <HiChatBubbleOvalLeft size={13} /> {q.commentsCount}
              </span>
              <span className="flex items-center gap-1 ml-auto">
                <HiEye size={13} /> {q.viewsCount}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-8 mt-4 flex items-center justify-center">
        {loadingMore && (
          <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
}
