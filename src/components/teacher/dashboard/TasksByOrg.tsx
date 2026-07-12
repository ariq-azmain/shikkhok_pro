import type { TaskGroup } from "@/types";
import TaskCard from "./TaskCard";

interface TasksByOrgProps {
  taskGroups: TaskGroup[];
  onTaskClick?: (taskId: string) => void;
}

export default function TasksByOrg({
  taskGroups = [],
  onTaskClick,
}: TasksByOrgProps) {
  if (!taskGroups || taskGroups.length === 0) {
    return <div className="text-sm text-muted">No assigned tasks.</div>;
  }

  return (
    <div className="space-y-4">
      {taskGroups.map((group) => (
        <div
          key={group.orgId}
          className="rounded-lg border border-white/10 p-4 bg-[var(--bg-card)]"
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm">{group.orgName}</h3>
              <p className="text-xs text-muted mt-1">
                {group.tasks.length} tasks
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
            {group.tasks.slice(0, 4).map((task) => (
              <TaskCard key={task.id} task={task} onClick={onTaskClick} />
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(group.statusCounts).map(([status, count]) => (
              <span
                key={status}
                className="text-xs px-2 py-1 rounded-full bg-muted-10 text-[var(--text-secondary)]"
              >
                {status}: {count}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
