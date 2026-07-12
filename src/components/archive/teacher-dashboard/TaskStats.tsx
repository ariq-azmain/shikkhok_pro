// src/components/teacher-dashboard/TaskStats.tsx
import React from "react";

function StatPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="inline-flex flex-col items-center justify-center px-3 py-2 bg-muted-20 rounded-lg">
      <div className="text-sm font-semibold">{value}</div>
      <div className="text-xs text-muted">{label}</div>
    </div>
  );
}

export default function TaskStats({
  stats,
}: {
  stats: Record<string, number>;
}) {
  return (
    // allow wrapping on small screens to prevent overflow
    <div className="flex items-center gap-3 flex-wrap">
      <StatPill label="Pending" value={stats.tasksPending ?? 0} />
      <StatPill label="In Progress" value={stats.tasksInProgress ?? 0} />
      <StatPill label="Submitted" value={stats.tasksSubmitted ?? 0} />
      <StatPill label="Done" value={stats.tasksDone ?? 0} />
      <StatPill label="Rejected" value={stats.tasksRejected ?? 0} />
    </div>
  );
}
