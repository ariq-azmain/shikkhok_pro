// src/components/profile/ProfileHeader.tsx
// ---------------------------------------------------------------
// Top section of any profile: avatar, name, bio, stats, badges.
// Works for both own profile and other users' profiles.
// ---------------------------------------------------------------
"use client";

import Link from "next/link";
import { HiCalendarDays, HiCheckBadge } from "react-icons/hi2";
import { ProfileAvatar } from "./ProfileAvatar";
import type { UserPublic, UserFull, AccountType } from "@/types";

type ProfileUser = Pick<
  UserPublic | UserFull,
  "username" | "displayName" | "avatar" | "bio" | "accountType" | "createdAt"
> & { questionCount?: number };

const ACCOUNT_TYPE_LABEL: Record<AccountType, { label: string; color: string }> = {
  TEACHER: { label: "Teacher", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" },
  STUDENT: { label: "Student", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  PARENT: { label: "Parent", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
};

interface ProfileHeaderProps {
  user: ProfileUser;
  isOwner?: boolean;
}

export function ProfileHeader({ user, isOwner = false }: ProfileHeaderProps) {
  const badge = ACCOUNT_TYPE_LABEL[user.accountType as AccountType];

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 pb-6 border-b border-white/5">
      {/* Avatar */}
      <ProfileAvatar
        src={user.avatar}
        displayName={user.displayName}
        size={96}
        editable={false}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-white leading-tight truncate">
            {user.displayName}
          </h1>
          {user.accountType === "TEACHER" && (
            <HiCheckBadge className="text-indigo-400 flex-shrink-0" size={22} />
          )}
          {badge && (
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.color}`}
            >
              {badge.label}
            </span>
          )}
        </div>

        <p className="text-gray-400 text-sm mb-3">@{user.username}</p>

        {user.bio && (
          <p className="text-gray-300 text-sm leading-relaxed mb-3 max-w-lg">
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <HiCalendarDays size={15} />
            Joined {joinedDate}
          </span>
          {user.questionCount !== undefined && (
            <span className="text-gray-400">
              <span className="text-white font-semibold">{user.questionCount}</span>{" "}
              public questions
            </span>
          )}
        </div>
      </div>

      {/* Owner action */}
      {isOwner && (
        <Link
          href="?tab=settings"
          className="flex-shrink-0 text-sm font-medium px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/20 transition-all duration-200"
        >
          Edit Profile
        </Link>
      )}
    </div>
  );
}
