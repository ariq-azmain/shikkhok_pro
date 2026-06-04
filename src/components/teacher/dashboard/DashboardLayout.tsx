"use client";

import React, { useState } from "react";
import type { DashboardUser } from "@/types";
import NavBar from "@/components/teacher/NavBar";
import Sidebar from "@/components/teacher/Sidebar";

export default function DashboardLayout({ user, children }: { user: DashboardUser; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen page-bg">
      <NavBar user={user} onToggleCollapse={() => setCollapsed((c) => !c)} />
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 flex gap-6">
        <Sidebar username={user.username} collapsed={collapsed} />
        <div className={`flex-1 ${collapsed ? "ml-4" : ""}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
