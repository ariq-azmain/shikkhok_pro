// src/components/profile/ProfileTabs.tsx
// ---------------------------------------------------------------
// Tab bar for the profile page.
// Reads/writes ?tab= search param via router.
// ---------------------------------------------------------------
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type ProfileTab = "questions" | "settings";

const TABS: { id: ProfileTab; label: string }[] = [
  { id: "questions", label: "Questions" },
  { id: "settings", label: "Settings" },
];

interface ProfileTabsProps {
  isOwner: boolean;
  activeTab: ProfileTab;
}

export function ProfileTabs({ isOwner, activeTab }: ProfileTabsProps) {
  const router = useRouter();
  const pathname = usePathname();

  const visibleTabs = isOwner ? TABS : TABS.filter((t) => t.id !== "settings");

  const navigate = (tab: ProfileTab) => {
    const params = new URLSearchParams();
    if (tab !== "questions") params.set("tab", tab);
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="flex items-center gap-1 border-b border-white/6 mb-6">
      {visibleTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all duration-200 -mb-px border-b-2",
              isActive
                ? "text-indigo-400 border-indigo-500"
                : "text-gray-500 border-transparent hover:text-gray-300 hover:border-white/10"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
