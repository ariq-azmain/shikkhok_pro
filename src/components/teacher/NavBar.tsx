"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, List } from "lucide-react";

export default function NavBar({ user, onToggleCollapse, onToggleMobile, collapsed, mobileOpen }: any) {
  const profileUrl = user?.username ? `/profile/${user.username}` : "/profile";

  return (
    <header className="w-full flex items-center justify-between py-3 px-3 border-b border-muted card-bg">
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle: visible on small screens only */}
        <button type="button" onClick={onToggleMobile} aria-label="Open menu" className="sm:hidden p-2 rounded-md hover:bg-muted-10">
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* Desktop collapse toggle: visible on md+ screens */}
        <button type="button" onClick={onToggleCollapse} aria-label="Toggle sidebar" className="hidden sm:inline-flex p-2 rounded-md hover:bg-muted-10">
          {/* show different icon based on collapsed state */}
          {collapsed ? <List size={18} /> : <List size={18} />}
        </button>

        <div className="w-8 h-8 rounded-md bg-muted-20 flex items-center justify-center">SP</div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-primary">Shikkhok Pro</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href={profileUrl} className="flex items-center gap-2">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.displayName || "avatar"} className="avatar-sm rounded-full object-cover" />
          ) : (
            <div className="avatar-sm rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">{(user?.displayName || "U").split(" ").map((s: string) => s[0]).join("").slice(0, 2)}</div>
          )}
        </Link>
      </div>
    </header>
  );
}
