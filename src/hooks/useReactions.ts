// src/hooks/useReactions.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  };
}

export function useLike(questionId: string, initialCount: number) {
  const { isSignedIn } = useUser();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Initial like status fetch
  useEffect(() => {
    if (!isSignedIn) return;
    fetch(`/api/questions/${questionId}/like`)
      .then((r) => r.json())
      .then((d) => setLiked(d.liked ?? false))
      .catch(() => {});
  }, [questionId, isSignedIn]);

  const toggle = useCallback(async () => {
    if (!isSignedIn || loading) return;
    setLoading(true);

    // Optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));

    try {
      const res = await fetch(`/api/questions/${questionId}/like`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setLiked(data.liked);
        setCount(data.likesCount);
      } else {
        // Rollback on error
        setLiked((prev) => !prev);
        setCount((prev) => (liked ? prev + 1 : prev - 1));
      }
    } catch {
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  }, [questionId, liked, loading, isSignedIn]);

  return { liked, count, toggle, loading };
}

export function useComments(questionId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/questions/${questionId}/comments`);
      const data = await res.json();
      if (res.ok) {
        setComments(data.data);
        setNextCursor(data.nextCursor);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const postComment = useCallback(
    async (content: string, parentId?: string): Promise<Comment | null> => {
      setPosting(true);
      setError(null);
      try {
        const res = await fetch(`/api/questions/${questionId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, parentId }),
        });
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (!res.ok) throw new Error(data.error || "Failed to post");

        // Top-level comment হলে list এ যোগ করো
        if (!parentId) {
          setComments((prev) => [...prev, data.data]);
        }
        return data.data;
      } catch (err: any) {
        setError(err.message);
        return null;
      } finally {
        setPosting(false);
      }
    },
    [questionId]
  );

  const deleteComment = useCallback(
    async (commentId: string, parentId?: string) => {
      try {
        await fetch(`/api/questions/${questionId}/comments/${commentId}`, {
          method: "DELETE",
        });
        if (!parentId) {
          setComments((prev) => prev.filter((c) => c.id !== commentId));
        }
      } catch {}
    },
    [questionId]
  );

  return { comments, loading, posting, error, nextCursor, postComment, deleteComment };
}

export function useShare(questionId: string, initialCount: number) {
  const [count, setCount] = useState(initialCount);

  const share = useCallback(async () => {
    const url = `${window.location.origin}/q/${questionId}`;

    // Web Share API (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {}
    } else {
      // Fallback: clipboard copy
      await navigator.clipboard.writeText(url);
    }

    // Count increment
    try {
      const res = await fetch(`/api/questions/${questionId}/share`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) setCount(data.sharesCount);
    } catch {}
  }, [questionId]);

  return { count, share };
}
