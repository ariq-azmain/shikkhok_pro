// src/components/profile/ProfileSettings.tsx
// src/components/profile/ProfileSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi2";
import { ProfileAvatar } from "./ProfileAvatar";
import { useProfile } from "@/hooks/useProfile";
import { useAvatarUpload } from "@/hooks/useAvatarUpload";
import { cn } from "@/lib/utils";

export function ProfileSettings() {
  const { profile, loading, saving, saveError, update } = useProfile();
  const { uploading, uploadError, uploadAvatar } = useAvatarUpload();

  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saved, setSaved] = useState(false);
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio ?? "");
      setLocalAvatar(profile.avatar);
    }
  }, [profile]);

  const handleAvatarSelect = async (file: File) => {
    if (!profile) return;
    const url = await uploadAvatar(file, profile.id);
    if (url) setLocalAvatar(url);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await update({ displayName, bio });
    if (ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-7 h-7 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const isBusy = saving || uploading;

  return (
    <form onSubmit={handleSave} className="max-w-xl flex flex-col gap-7">
      {/* Avatar */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-3">
          Profile Photo
        </label>
        <div className="flex items-center gap-5">
          <ProfileAvatar
            src={localAvatar}
            displayName={profile.displayName}
            size={80}
            editable
            uploading={uploading}
            onFileSelect={handleAvatarSelect}
          />
          <div className="text-xs text-gray-500 leading-relaxed">
            <p>Click the photo to change it.</p>
            <p>JPG, PNG, WebP or GIF · Max 5 MB</p>
            {uploadError && (
              <p className="text-red-400 mt-1 flex items-center gap-1">
                <HiExclamationCircle size={13} />
                {uploadError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Display Name */}
      <div>
        <label
          htmlFor="displayName"
          className="block text-sm font-semibold text-gray-300 mb-2"
        >
          Display Name
          <span className="text-red-400 ml-0.5">*</span>
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={60}
          required
          placeholder="Your full name"
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200",
            "bg-muted-20 border border-muted-2 text-white placeholder:text-gray-600",
            "focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30",
          )}
        />
        <p className="text-xs text-gray-600 mt-1 text-right">
          {displayName.length}/60
        </p>
      </div>

      {/* Username (read-only) */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Username
        </label>
        <div
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm",
            "bg-muted-10 border border-muted text-gray-500 select-none cursor-not-allowed",
          )}
        >
          @{profile.username}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Username cannot be changed after signup.
        </p>
      </div>

      {/* Email (read-only) */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Email
        </label>
        <div
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm",
            "bg-muted-10 border border-muted text-gray-500 select-none cursor-not-allowed",
          )}
        >
          {profile.email}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Manage your email in{" "}
          <a href="/user-settings" className="text-indigo-400 hover:underline">
            account settings
          </a>
          .
        </p>
      </div>

      {/* Bio */}
      <div>
        <label
          htmlFor="bio"
          className="block text-sm font-semibold text-gray-300 mb-2"
        >
          Bio <span className="text-gray-600 font-normal ml-1">(optional)</span>
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={200}
          rows={3}
          placeholder="Tell others a little about yourself…"
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200",
            "bg-muted-20 border border-muted-2 text-white placeholder:text-gray-600",
            "focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30",
          )}
        />
        <p className="text-xs text-gray-600 mt-1 text-right">
          {bio.length}/200
        </p>
      </div>

      {/* Account type (read-only) */}
      <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Account Type
        </label>
        <div
          className={cn(
            "w-full rounded-xl px-4 py-3 text-sm",
            "bg-muted-10 border border-muted text-gray-500 select-none cursor-not-allowed",
          )}
        >
          {profile.accountType.charAt(0) +
            profile.accountType.slice(1).toLowerCase()}
        </div>
        <p className="text-xs text-gray-600 mt-1">
          Set during onboarding. Contact support to change.
        </p>
      </div>

      {/* Error */}
      {saveError && (
        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/8 border border-red-500/15 rounded-xl px-4 py-3">
          <HiExclamationCircle size={16} className="flex-shrink-0" />
          {saveError}
        </div>
      )}

      {/* Success */}
      {saved && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/8 border border-emerald-500/15 rounded-xl px-4 py-3">
          <HiCheckCircle size={16} className="flex-shrink-0" />
          Profile saved successfully.
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isBusy || !displayName.trim()}
        className={cn(
          "w-full sm:w-auto sm:self-start",
          "px-7 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
          isBusy || !displayName.trim()
            ? "bg-muted-20 text-gray-600 cursor-not-allowed"
            : "bg-indigo-500 text-white hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/20",
        )}
      >
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}
