// src/hooks/useQuestionFeed.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Question } from "@/types/question";

interface Filters {
  subject?: string;
  className?: string;
  difficulty?: string;
}

export function useQuestionFeed(filters: Filters = {}) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const buildUrl = useCallback(
    (cursor?: string) => {
      const params = new URLSearchParams();
      if (cursor) params.set("cursor", cursor);
      if (filters.subject) params.set("subject", filters.subject);
      if (filters.className) params.set("class", filters.className);
      if (filters.difficulty) params.set("difficulty", filters.difficulty);
      return `/api/questions?${params.toString()}`;
    },
    [filters.subject, filters.className, filters.difficulty],
  );

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setError(null);
    setQuestions([]);
    setNextCursor(null);
    setHasMore(true);

    try {
      const res = await fetch(buildUrl());
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setQuestions(json.data);
      setNextCursor(json.nextCursor);
      setHasMore(!!json.nextCursor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [buildUrl]);

  const fetchMore = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);

    try {
      const res = await fetch(buildUrl(nextCursor));
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setQuestions((prev) => [...prev, ...json.data]);
      setNextCursor(json.nextCursor);
      setHasMore(!!json.nextCursor);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore, buildUrl]);

  // Intersection Observer — sentinel div দেখলে fetchMore
  const setSentinel = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      sentinelRef.current = node;

      if (!node) return;

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loadingMore) {
            fetchMore();
          }
        },
        { threshold: 0.1 },
      );
      observerRef.current.observe(node);
    },
    [hasMore, loadingMore, fetchMore],
  );

  // Filter বদলালে refetch করো
  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Cleanup
  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return {
    questions,
    loading,
    loadingMore,
    error,
    hasMore,
    setSentinel,
    refetch: fetchQuestions,
  };
}
