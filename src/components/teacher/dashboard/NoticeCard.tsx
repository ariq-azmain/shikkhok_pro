import type { NoticePreview } from "@/types";
import { Pin } from "lucide-react";

interface NoticeCardProps {
  notice: NoticePreview;
  onClick?: (noticeId: string) => void;
}

export default function NoticeCard({ notice, onClick }: NoticeCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(notice.id)}
      className="w-full text-left p-3 rounded-lg bg-muted-10 hover:bg-muted-20 transition border border-muted-10"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{notice.title}</div>
          <div className="text-xs text-muted mt-1">{notice.org.name}</div>
        </div>
        {notice.isPinned && (
          <Pin className="w-4 h-4 flex-shrink-0 text-amber-500" />
        )}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs px-2 py-1 rounded-full bg-muted-20 text-[var(--text-secondary)]">
          {notice.type}
        </span>
        <span className="text-xs text-muted">
          {new Date(notice.createdAt).toLocaleDateString()}
        </span>
      </div>
    </button>
  );
}
