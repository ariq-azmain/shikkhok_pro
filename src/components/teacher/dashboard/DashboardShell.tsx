import NavBar from "@/components/teacher/dashboard/NavBar";
import Sidebar from "@/components/teacher/dashboard/Sidebar";
import TopCharts from "@/components/teacher/dashboard/TopCharts";
import SectionCard from "@/components/teacher/dashboard/SectionCard";

export default function DashboardShell({ user, tasksPreview, noticesPreview, tasksCount, noticesCount }: any) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <NavBar user={user} />
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-[240px_1fr] gap-6">
        <Sidebar username={user?.username} />

        <main>
          <TopCharts />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <SectionCard title="Tasks" count={tasksCount} href="/tasks" items={tasksPreview} type="tasks" />
            <SectionCard title="Notices" count={noticesCount} href="/notices" items={noticesPreview} type="notices" />
            <SectionCard title="Question Editor" count={0} href="/question-editor" items={[]} type="editor" />
          </div>

        </main>
      </div>
    </div>
  );
}
