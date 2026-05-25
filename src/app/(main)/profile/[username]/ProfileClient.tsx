// src/app/(main)/profile/[username]/ProfileClient.tsx
// Client boundary — tab routing + content switching.
"use client";

import {
  ProfileHeader,
  ProfileTabs,
  ProfileSettings,
  ProfileQuestions,
} from "@/components/profile";
import type { ProfileTab } from "@/components/profile";

interface ProfileClientProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
    bio: string | null;
    accountType: string;
    createdAt: string;
    questionCount: number;
  };
  isOwner: boolean;
  initialTab: ProfileTab;
}

export function ProfileClient({ user, isOwner, initialTab }: ProfileClientProps) {
  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader user={user} isOwner={isOwner} />

      <div>
        <ProfileTabs isOwner={isOwner} activeTab={initialTab} />

        {initialTab === "questions" && (
          <ProfileQuestions username={user.username} />
        )}

        {initialTab === "settings" && isOwner && <ProfileSettings />}
      </div>
    </div>
  );
}
