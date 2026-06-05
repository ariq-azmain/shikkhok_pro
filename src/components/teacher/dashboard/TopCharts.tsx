"use client";

import TasksChart from "@/components/teacher/dashboard/TasksChart";
import ActivityPieChart from "@/components/teacher/dashboard/ActivityPieChart";

export default function TopCharts() {
  // For overview we could accept props; for now charts render empty or demo data
  const demoLabels = ["PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"];
  const demoData = [5, 2, 1, 8, 0];
  const demoActivity = { questionsCreated: 8, commentsMade: 12, likesMade: 20, noticesPosted: 3 };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl p-4 bg-[var(--bg-card)] border border-muted-10">
        <h3 className="text-lg font-semibold mb-3">Tasks Overview</h3>
        <div style={{ height: 260 }}>
          <TasksChart labels={demoLabels} data={demoData} />
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-muted-10">
        <h3 className="text-lg font-semibold mb-3">Activity</h3>
        <div style={{ height: 260 }}>
          <ActivityPieChart data={demoActivity} />
        </div>
      </div>
    </div>
  );
}
