"use client";
import React from "react";
import type { UserSummary } from "@/types";

export default function TeacherShell({ user, children }: { user: UserSummary; children: React.ReactNode }) {
  // TeacherShell no longer renders global NavBar/Sidebar — those are provided
  // by page-level wrappers (e.g., dashboard) to avoid duplicated chrome.
  return (
    <div className="min-h-screen page-bg">
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
