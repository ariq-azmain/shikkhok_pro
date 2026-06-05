"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Settings, Inbox, BookOpen, MessageSquare, FileText, Home } from "lucide-react";

export default function Sidebar({ username }: { username?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const nav = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/tasks", label: "Tasks", icon: BookOpen },
    { href: "/notices", label: "Notices", icon: Inbox },
    { href: "/messaging", label: "Messaging", icon: MessageSquare },
    { href: "/question-editor", label: "Question Editor", icon: FileText },
    { href: "/banks", label: "Question Banks", icon: BookOpen },
  ];

  const settingsUrl = username ? `/profile/${username}?tab=settings` : "/profile";

  return (
    <>
      {/* Mobile top bar */}
      <div className="sm:hidden flex items-center justify-between p-3">
        <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="p-2 rounded-md bg-muted-10">
          <Menu size={18} />
        </button>
        <div className="font-semibold">Menu</div>
      </div>

      {/* Sidebar for desktop */}
      <aside className="hidden sm:flex sm:flex-col sm:w-64 sm:pt-4 sm:gap-4">
        <nav className="flex-1 px-4 space-y-2">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-md ${pathname === item.href ? "bg-indigo-500/10" : "hover:bg-muted-20"}`}>
              <item.icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-4 py-3">
          <Link href={settingsUrl} className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted-20">
            <Settings size={18} />
            <span className="text-sm">Settings</span>
          </Link>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        // overlay should close the drawer when clicked outside the panel
        <div className="fixed inset-0 z-50 bg-black/40 sm:hidden" onClick={() => setOpen(false)}>
          {/* stop clicks inside the panel from bubbling to the overlay */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--bg-card)] p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Menu</div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 rounded-md bg-muted-10"><X size={18} /></button>
            </div>
            <nav className="space-y-2">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  // removed overlay-closing via link click; overlay only closes when user clicks outside
                  className={`flex items-center gap-3 px-3 py-2 rounded-md ${pathname === item.href ? "bg-indigo-500/10" : "hover:bg-muted-20"}`}>
                  <item.icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="mt-6">
              <Link href={settingsUrl} className={`flex items-center gap-2 px-3 py-2 rounded-md ${pathname === settingsUrl ? "bg-indigo-500/10" : "hover:bg-muted-20"}`}>
                <Settings size={18} />
                <span className="text-sm">Settings</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
