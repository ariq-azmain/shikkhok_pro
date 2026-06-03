import Link from "next/link";

export default function SectionCard({ title, count, href, items, type }: any) {
  return (
    <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-white/5 h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold">{title}</h4>
          <div className="text-sm text-[var(--text-muted)]">{count}</div>
        </div>

        <div className="mt-3 space-y-2">
          {items && items.length > 0 ? (
            items.map((it: any) => (
              <div key={it.id} className="text-sm text-[var(--text-muted)]">{it.title ?? it.name ?? it.id}</div>
            ))
          ) : (
            <div className="text-sm text-[var(--text-muted)]">No items</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link href={href} className="text-sm font-semibold text-indigo-400 hover:underline">Learn more →</Link>
      </div>
    </div>
  );
}
