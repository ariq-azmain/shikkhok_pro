"use client";

import React from "react";
import OrgList from "./OrgList";
import MyQuestionsList from "./MyQuestionsList";
import TasksByOrg from "./TasksByOrg";
import NoticesList from "./NoticesList";
import TaskStats from "./TaskStats";
import TasksChart from "./TasksChart";
import ActivityPieChart from "./ActivityPieChart";

// Dashboard shell — composes many small components into a two-column layout.
export default function TeacherDashboardShell({
  user,
  orgsOwned,
  orgsMember,
  myQuestions,
  tasksByOrg,
  notices,
  stats,
  tasksChart,
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column: orgs + notices */}
      <aside className="col-span-1 space-y-4">
        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h2 className="text-lg font-semibold mb-2">Hello, {user.displayName}</h2>
          <p className="text-sm text-muted">Welcome to your teacher dashboard.</p>
        </div>

        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-sm font-semibold mb-3">Your Organizations</h3>
          <OrgList orgsOwned={orgsOwned} orgsMember={orgsMember} />
        </div>

        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-sm font-semibold mb-3">Recent Notices</h3>
          <NoticesList notices={notices} />
        </div>
      </aside>

      {/* Center column: questions + tasks by org */}
      <section className="col-span-1 lg:col-span-2 space-y-4">
        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-lg font-semibold mb-3">My Questions</h3>
          <MyQuestionsList questions={myQuestions} />
        </div>

        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-lg font-semibold mb-3">Tasks</h3>
          <TaskStats stats={stats} />
          <div className="mt-4">
            <TasksChart labels={tasksChart.labels} data={tasksChart.data} />
          </div>
          <div className="mt-6">
            <TasksByOrg tasksByOrg={tasksByOrg} />
          </div>
        </div>
      </section>

      {/* Full-width bottom: activity chart */}
      <div className="col-span-1 lg:col-span-3">
        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-lg font-semibold mb-3">Activity</h3>
          <ActivityPieChart data={{/* placeholder - can be wired to activity counts */}} />
        </div>
      </div>
    </div>
  );
}
