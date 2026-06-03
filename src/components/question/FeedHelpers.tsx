export type Filters = {
  subject: string;
  className: string;
  difficulty: string;
};

export function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 border border-white/5 animate-pulse" style={{ background: "var(--bg-card)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-white/5" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 rounded bg-white/5 w-1/3" />
          <div className="h-2.5 rounded bg-white/5 w-1/5" />
        </div>
      </div>
      <div className="h-4 rounded bg-white/5 w-3/4 mb-2" />
      <div className="h-4 rounded bg-white/5 w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 rounded-full bg-white/5 w-20" />
        <div className="h-5 rounded-full bg-white/5 w-16" />
        <div className="h-5 rounded-full bg-white/5 w-12" />
      </div>
      <div className="h-px bg-white/5 mb-3" />
      <div className="flex gap-4">
        <div className="h-3 rounded bg-white/5 w-10" />
        <div className="h-3 rounded bg-white/5 w-10" />
        <div className="h-3 rounded bg-white/5 w-10" />
      </div>
    </div>
  );
}
