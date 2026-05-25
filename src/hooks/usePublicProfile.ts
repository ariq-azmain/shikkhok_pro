// src/hooks/usePublicProfile.ts
// Fetch another user's public profile (read-only).
"use client";

import { useState, useEffect } from "react";
import type { UserPublic } from "@/types";

export function usePublicProfile(username: string) {
  const [profile, setProfile] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    setLoading(true);
    setNotFound(false);
    setError(null);

    fetch(`/api/profile/${encodeURIComponent(username)}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error ?? "Failed to load profile");
        }
        setProfile(await res.json());
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [username]);

  return { profile, loading, notFound, error };
}
