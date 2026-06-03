import Link from "next/link";
import Image from "next/image";

export default function NavBar({ user }: any) {
  // Server component acceptable; avatar URL comes from user.avatar
  const profileUrl = user?.username ? `/profile/${user.username}` : "/profile";
  const settingsUrl = user?.username ? `/profile/${user.username}?tab=settings` : "/profile";

  return (
    <header className="w-full flex items-center justify-between py-3 px-4 border-b border-white/5" style={{ background: "var(--bg-card)" }}>
      <div className="flex items-center gap-3">
        {/* App icon placeholder */}
        <div className="w-8 h-8 rounded-md bg-white/3 flex items-center justify-center"> </div>
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Shikkhok Pro</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href={profileUrl} className="flex items-center gap-2">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.displayName || "avatar"} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">{(user?.displayName || "U").split(" ").map((s: string)=>s[0]).join("").slice(0,2)}</div>
          )}
        </Link>
      </div>
    </header>
  );
}
