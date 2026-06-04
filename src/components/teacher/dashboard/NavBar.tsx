import Link from "next/link";
import type { DashboardUser } from "@/types";

interface NavBarProps {
  user: DashboardUser;
}

export default function NavBar({ user }: NavBarProps) {
  const profileUrl = user?.username ? `/profile/${user.username}` : "/profile";

  return (
    <header className="w-full flex items-center justify-between py-3 px-4 border-b border-white/10 bg-[var(--bg-card)]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-md bg-muted-10 flex items-center justify-center text-sm font-semibold">SP</div>
        <h1 className="hidden sm:block text-lg font-semibold text-primary">Shikkhok Pro</h1>
      </div>

      <Link href={profileUrl} className="flex items-center gap-2">
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt={user.displayName || "avatar"} className="w-9 h-9 rounded-full object-cover" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-sm">
            {(user?.displayName || "U").split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </div>
        )}
      </Link>
    </header>
  );
}
