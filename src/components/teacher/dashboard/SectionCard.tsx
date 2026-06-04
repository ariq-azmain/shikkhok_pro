import Link from "next/link";
import type { SectionCardProps } from "@/types";
import TaskCard from "./TaskCard";
import NoticeCard from "./NoticeCard";

export default function SectionCard<T extends Record<string, unknown>>(props: SectionCardProps<T>) {
  const { title, count, href, items, type, isLoading } = props;

  return (
    <div className="rounded-xl border border-white/10 p-4 bg-[var(--bg-card)] h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold">{title}</h3>
          <span className="text-sm px-2 py-1 rounded-full bg-muted-10 text-[var(--text-secondary)]">{count}</span>
        </div>

        {isLoading ? (
          <div className="text-sm text-[var(--text-muted)]">Loading...</div>
        ) : items && items.length > 0 ? (
          <div className="space-y-2">
            {items.slice(0, 3).map((item: any) => {
              if (type === "tasks") {
                return <TaskCard key={(item as any).id} task={item as any} />;
              } else if (type === "notices") {
                return <NoticeCard key={(item as any).id} notice={item as any} />;
              }

              return (
                <div key={(item as any).id} className="text-sm text-[var(--text-muted)]">{(item as any).title || (item as any).name || (item as any).id}</div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-[var(--text-muted)]">No items</div>
        )}
      </div>

      <Link href={href} className="mt-4 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition">View all →</Link>
    </div>
  );
}
