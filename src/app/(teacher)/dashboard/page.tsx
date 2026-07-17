import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { useActivity } from "@/hooks/useActivity";
import SectionCard from "@/components/teacher/dashboard/SectionCard";
import TopCharts from "@/components/teacher/dashboard/TopCharts";

export const metadata: Metadata = {
  title: "Teacher Dashboard — Shikkhok Pro",
};

export default async function Page() {
  const { userId: clerkId } = await auth();
  if (!clerkId) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">
          Please sign in to view the dashboard.
        </p>
      </main>
    );
  }

  let activity;
  try {
    activity = await useActivity();
  } catch (error) {
    console.error("[TeacherDashboard] useActivity error:", error);
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-[var(--text-muted)]">
          {error instanceof Error ? error.message : "Failed to load dashboard data."}
        </p>
      </main>
    );
  }

  const { tasksPreview, noticesPreview, stats, failedOperations } = activity;

  // Log failed operations for debugging
  if (failedOperations.length > 0) {
    console.warn("[TeacherDashboard] Failed operations:", failedOperations);
  }

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">
            Teacher Dashboard
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Overview of your tasks, notices, and activity
          </p>
        </div>

        {/* Charts Section */}
        <TopCharts activity={activity} />

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard
            title="Recent Tasks"
            count={stats.tasksCount}
            href="/tasks"
            items={tasksPreview}
            type="tasks"
            isLoading={false}
          />
          <SectionCard
            title="Recent Notices"
            count={stats.noticesCount}
            href="/notices"
            items={noticesPreview}
            type="notices"
            isLoading={false}
          />
        </div>
      </div>
    </main>
  );
}
