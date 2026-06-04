"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import type { UserSummary } from "@/types";
import { BookOpen, Inbox, MessageSquare, FileText, Settings as IconSettings } from "lucide-react";

export default function Sidebar({ username, collapsed, onClose }: { username?: string | null; collapsed?: boolean; onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = [
    { href: "/tasks", label: "Tasks", icon: BookOpen },
    { href: "/notices", label: "Notices", icon: Inbox },
    { href: "/messaging", label: "Messaging", icon: MessageSquare },
    { href: "/question-editor", label: "Question Editor", icon: FileText },
    { href: "/banks", label: "Question Banks", icon: BookOpen },
  ];

  const settingsUrl = username ? `/profile/${username}?tab=settings` : "/profile";

  // Mobile top bar
  if (!collapsed) {
    // render normal sidebar
  }

  return (
    <>
      <div className="sm:hidden flex items-center justify-between p-3">
        <button onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 rounded-md hover:bg-muted-10">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18" /></svg>
        </button>
        <div className="font-semibold">Menu</div>
      </div>

      {/* Desktop sidebar */}
      <aside className={`hidden sm:flex sm:flex-col ${collapsed ? "w-20" : "w-64"} sm:pt-4 sm:gap-4`}>
        <nav className="flex-1 px-4 space-y-2">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md ${active ? "bg-muted-10" : "hover:bg-muted-05"}`}
              >
                <item.icon size={18} />
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-3">
          <Link href={settingsUrl} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted-05">
            <IconSettings size={18} />
            {!collapsed && <span className="text-sm">Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 bg-overlay-dark sm:hidden">
          <div className="absolute left-0 top-0 bottom-0 w-72 card-bg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Menu</div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-md hover:bg-muted-10">✕</button>
            </div>
            <nav className="space-y-2">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => { setOpen(false); onClose?.(); }} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted-05">
                  <item.icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-6">
              <Link href={settingsUrl} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted-05">
                <IconSettings size={18} />
                <span className="text-sm">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
