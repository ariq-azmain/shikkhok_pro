import type { DashboardShellProps } from "@/types";
import NavBar from "./NavBar";
import Sidebar from "./Sidebar";
import TopCharts from "./TopCharts";
import SectionCard from "./SectionCard";

export default function DashboardShell({ user, tasksPreview, noticesPreview, tasksCount, noticesCount }: DashboardShellProps) {
  return (
    <div className="min-h-screen page-bg">
      <NavBar user={user} />
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-6">
        <Sidebar username={user?.username} />

        <main>
          <TopCharts />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <SectionCard title="Recent Tasks" count={tasksCount} href="/tasks" items={tasksPreview} type="tasks" />
            <SectionCard title="Notices" count={noticesCount} href="/notices" items={noticesPreview} type="notices" />
            <SectionCard
              title="Quick Links"
              count={0}
              href="/editor"
              items={[{ id: "1", title: "Create Question", href: "/create/editor" }, { id: "2", title: "Question Banks", href: "/banks" }]}
              type="editor"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
