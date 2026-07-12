"use client";
import React, { useState } from "react";
import type { UserSummary } from "@/types";
import NavBar from "@/components/teacher/NavBar";
import Sidebar from "@/components/teacher/Sidebar";

export default function TeacherShell({
  user,
  children,
}: {
  user: UserSummary;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen page-bg">
      <NavBar
        user={user}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onToggleMobile={() => setMobileOpen((o) => !o)}
      />

      <div className="relative z-10 teacher-container mx-auto flex gap-6">
        <Sidebar
          username={user.username}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        <div className={`flex-1 ${collapsed ? "ml-4" : ""}`}>{children}</div>
      </div>
    </div>
  );
}
