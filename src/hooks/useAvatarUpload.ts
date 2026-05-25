// src/hooks/useAvatarUpload.ts
// ---------------------------------------------------------------
// Avatar upload flow (browser → Supabase Storage → DB):
//
//  1. User picks a file → browser File object
//  2. This hook calls uploadFile() from lib/supabase/storage.ts
//     which uses the BROWSER (anon key) Supabase client.
//     The "avatars" bucket must be set to PUBLIC in Supabase Dashboard.
//  3. Supabase Storage returns a permanent public URL.
//  4. We PATCH /api/profile/me with { avatar: url }
//     → server uses service role client to write avatar column in DB.
//  5. Hook returns the public URL so the UI can show it immediately.
//
// Bucket policy needed in Supabase Dashboard:
//   Storage → avatars → Policies → INSERT allowed for authenticated users
//   SELECT allowed for everyone (public bucket)
// ---------------------------------------------------------------
"use client";

import { useState, useCallback } from "react";
import { uploadFile, buildStoragePath, BUCKETS } from "@/lib/supabase/storage";

interface UseAvatarUploadReturn {
  uploading: boolean;
  uploadError: string | null;
  /** Upload file to Supabase Storage and persist URL in DB */
  uploadAvatar: (file: File, userId: string) => Promise<string | null>;
}

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function useAvatarUpload(): UseAvatarUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadAvatar = useCallback(
    async (file: File, userId: string): Promise<string | null> => {
      // ── Client-side validation ─────────────────────────────
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`Image must be smaller than ${MAX_SIZE_MB} MB`);
        return null;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError("Only JPG, PNG, WebP, or GIF images are allowed");
        return null;
      }

      setUploading(true);
      setUploadError(null);

      try {
        // ── Step 1: Upload to Supabase Storage ────────────────
        // Path: avatars/{userId}/avatar/{timestamp}.{ext}
        // upsert: true → overwrites old file at same path
        const path = buildStoragePath(userId, file.name, "avatar");

        const publicUrl = await uploadFile({
          bucket: BUCKETS.AVATARS,
          path,
          file,
          contentType: file.type,
        });

        // ── Step 2: Persist URL in DB via API ─────────────────
        const res = await fetch("/api/profile/me", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ avatar: publicUrl }),
        });

        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error ?? "Failed to save avatar URL");
        }

        return publicUrl;
      } catch (err: unknown) {
        setUploadError(err instanceof Error ? err.message : "Upload failed");
        return null;
      } finally {
        setUploading(false);
      }
    },
    []
  );

  return { uploading, uploadError, uploadAvatar };
}
