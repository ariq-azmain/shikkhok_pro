import type { DashboardShellProps } from "@/types";
import TopCharts from "./TopCharts";
import SectionCard from "./SectionCard";

export default function DashboardShell({
  user,
  tasksPreview,
  noticesPreview,
  tasksCount,
  noticesCount,
}: DashboardShellProps) {
  // DashboardShell now renders only the main dashboard content. The outer
  // TeacherShell (layout) provides NavBar and Sidebar so we avoid double-wrapping.
  return (
    <main className="space-y-6">
      <TopCharts />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionCard
          title="Recent Tasks"
          count={tasksCount}
          href="/tasks"
          items={tasksPreview}
          type="tasks"
        />
        <SectionCard
          title="Notices"
          count={noticesCount}
          href="/notices"
          items={noticesPreview}
          type="notices"
        />
        <SectionCard
          title="Quick Links"
          count={0}
          href="/question-editor"
          items={[
            { id: "1", title: "Create Question", href: "/question-editor" },
            { id: "2", title: "Question Banks", href: "/banks" },
          ]}
          type="editor"
        />
      </div>
    </main>
  );
}
