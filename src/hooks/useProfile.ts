// src/hooks/useProfile.ts
// ---------------------------------------------------------------
// Fetch + update own profile (settings tab).
// Uses /api/profile/me — no direct DB access from client.
// ---------------------------------------------------------------
"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserFull, ProfileUpdatePayload } from "@/types";

interface UseProfileReturn {
  profile: UserFull | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveError: string | null;
  update: (payload: ProfileUpdatePayload) => Promise<boolean>;
  refetch: () => void;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserFull | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/profile/me");
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Failed to load profile");
      }
      const data = await res.json();
      setProfile(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const update = useCallback(async (payload: ProfileUpdatePayload): Promise<boolean> => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      // Merge only the returned fields
      if (json.data) {
        setProfile((prev) => (prev ? { ...prev, ...json.data } : prev));
      }
      return true;
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setSaving(false);
    }
  }, []);

  return { profile, loading, error, saving, saveError, update, refetch: fetchProfile };
}
