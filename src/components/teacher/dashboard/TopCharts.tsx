import TasksChart from "@/components/teacher/dashboard/TasksChart";
import ActivityPieChart from "@/components/teacher/dashboard/ActivityPieChart";
import type { DashboardActivity } from "@/hooks/useActivity";

interface TopChartsProps {
  activity: DashboardActivity;
}

export default function TopCharts({ activity }: TopChartsProps) {
  const { stats } = activity;

  // Convert status counts to chart format
  const taskLabels = ["PENDING", "IN_PROGRESS", "SUBMITTED", "APPROVED", "REJECTED"];
  
  // Filter out -1 (error values) and only show valid counts
  const taskData = taskLabels.map((status) => {
    const count = stats.statusCounts?.[status as keyof typeof stats.statusCounts] ?? 0;
    return count >= 0 ? count : 0; // Convert -1 errors to 0 for display
  });

  // Activity data with error handling
  const activityData = {
    questionsCreated:
      stats.activityCounts?.questionsCreated ?? 0 >= 0
        ? stats.activityCounts?.questionsCreated ?? 0
        : 0,
    commentsMade:
      stats.activityCounts?.commentsMade ?? 0 >= 0
        ? stats.activityCounts?.commentsMade ?? 0
        : 0,
    likesMade:
      stats.activityCounts?.likesMade ?? 0 >= 0
        ? stats.activityCounts?.likesMade ?? 0
        : 0,
    noticesPosted:
      stats.activityCounts?.noticesPosted ?? 0 >= 0
        ? stats.activityCounts?.noticesPosted ?? 0
        : 0,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 rounded-2xl p-4 bg-[var(--bg-card)] border border-muted-10">
        <h3 className="text-lg font-semibold mb-3">Tasks Overview</h3>
        <div style={{ height: 260 }}>
          <TasksChart labels={taskLabels} data={taskData} />
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-[var(--bg-card)] border border-muted-10">
        <h3 className="text-lg font-semibold mb-3">Activity</h3>
        <div style={{ height: 260 }}>
          <ActivityPieChart data={activityData} />
        </div>
      </div>
    </div>
  );
}
