// src/components/teacher/dashboard/NavBar.tsx
import Link from "next/link";
import type { DashboardUser } from "@/types";

export default function NavBar({ user }: any) {
  const profileUrl = user?.username ? `/profile/${user.username}` : "/profile";

  return (
    <header className="w-full flex items-center justify-between py-3 px-4 border-b border-muted card-bg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-muted-20 flex items-center justify-center"> </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Shikkhok Pro</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href={profileUrl} className="flex items-center gap-2">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.displayName || "avatar"} className="avatar-sm rounded-full object-cover" />
          ) : (
            <div className="avatar-sm rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">{(user?.displayName || "U").split(" ").map((s: string)=>s[0]).join("").slice(0,2)}</div>
          )}
        </Link>
      </div>
    </header>
  );
}
