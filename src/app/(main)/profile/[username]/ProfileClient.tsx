// src/app/(main)/profile/[username]./ProfileClient.tsx
// Client boundary — tab routing সম্পূর্ণ client-side।
// useSearchParams() দিয়ে ?tab= পড়ে, router.push() দিয়ে update করে।
// Server থেকে আর initialTab prop আসে না।
"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Suspense } from "react";

import {
  ProfileHeader,
  ProfileSettings,
  ProfileQuestions,
} from "@/components/profile";
import { cn } from "@/lib/utils";

// ── Types ────────────────────────────────────────────────────
export type ProfileTab = "questions" | "settings";

interface ProfileUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string | null;
  bio: string | null;
  accountType: string;
  createdAt: string;
  questionCount: number;
}

interface ProfileClientProps {
  user: ProfileUser;
  isOwner: boolean;
}

//── Tab bar ──────────────────────────────────────────────────
const TABS: { id: ProfileTab; label: string }[] = [
  { id: "questions", label: "Questions" },
  { id: "settings", label: "Settings" },
];

function ProfileTabsInner({
  isOwner,
  activeTab,
  onTabChange,
}: {
  isOwner: boolean;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}) {
  const visibleTabs = isOwner ? TABS : TABS.filter((t) => t.id !== "settings");

  return (
    <div className="flex items-center gap-1 border-b border-[#ffffff37] mb-6">
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 -mb-px border-b-2",
              isActive
                ? "text-indigo-400 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-gray-300 hover:border-[#ffffff5a]",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Inner component — useSearchParams() ব্যবহার করে ──────────
// Suspense boundary এর ভেতরে রাখা হয়েছে (Next.js requirement)
function ProfileContent({ user, isOwner }: ProfileClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ?tab= query param থেকে active tab বের করো
  const tabParam = searchParams.get("tab");
  const activeTab: ProfileTab =
    isOwner && tabParam === "settings" ? "settings" : "questions";

  const handleTabChange = (tab: ProfileTab) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "questions") {
      params.delete("tab");
    } else {
      params.set("tab", tab);
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-8">
      <ProfileHeader user={user} isOwner={isOwner} />

      <div>
        <ProfileTabsInner
          isOwner={isOwner}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {activeTab === "questions" && (
          <ProfileQuestions username={user.username} />
        )}

        {activeTab === "settings" && isOwner && <ProfileSettings />}
      </div>
    </div>
  );
}

// ── Export — Suspense দিয়ে wrap করা (useSearchParams requirement) ──
export function ProfileClient({ user, isOwner }: ProfileClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col gap-8 animate-pulse">
          <div className="h-32 rounded-xl bg-white opacity-50" />
          <div className="h-64 rounded-xl bg-white opacity-50" />
        </div>
      }
    >
      <ProfileContent user={user} isOwner={isOwner} />
    </Suspense>
  );
}
