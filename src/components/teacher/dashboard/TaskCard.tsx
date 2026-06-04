import type { TaskPreview } from "@/types";
import { CheckCircle, AlertCircle, Clock } from "lucide-react";

interface TaskCardProps {
  task: TaskPreview;
  onClick?: (taskId: string) => void;
}

const statusIcon: Record<string, JSX.Element> = {
  PENDING: <Clock className="w-4 h-4 text-amber-500" />,
  IN_PROGRESS: <Clock className="w-4 h-4 text-blue-500" />,
  SUBMITTED: <CheckCircle className="w-4 h-4 text-cyan-500" />,
  APPROVED: <CheckCircle className="w-4 h-4 text-emerald-500" />,
  REJECTED: <AlertCircle className="w-4 h-4 text-red-500" />,
};

export default function TaskCard({ task, onClick }: TaskCardProps) {
  return (
    <button
      onClick={() => onClick?.(task.id)}
      className="w-full text-left p-3 rounded-lg bg-muted-10 hover:bg-muted-20 transition border border-white/10"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate">{task.title}</div>
          <div className="text-xs text-muted mt-1">{task.org.name}</div>
        </div>
        <div className="flex-shrink-0">{statusIcon[task.status]}</div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-[var(--text-secondary)]">{task.status}</span>
        {task.expireDate && (
          <span className="text-xs text-muted">{new Date(task.expireDate).toLocaleDateString()}</span>
        )}
      </div>
    </button>
  );
}
