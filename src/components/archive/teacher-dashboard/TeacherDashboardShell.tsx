"use client";

import React from "react";
import OrgList from "./OrgList";
import MyQuestionsList from "./MyQuestionsList";
import TasksByOrg from "./TasksByOrg";
import NoticesList from "./NoticesList";
import TaskStats from "./TaskStats";
import TasksChart from "./TasksChart";
import ActivityPieChart from "./ActivityPieChart";

// TeacherDashboardShell composes many small components into a multi-column layout.
// Props: user (id, displayName), orgsOwned, orgsMember, myQuestions, tasksByOrg,
// notices, stats, activity (for pie chart), tasksChart (labels + data for bar chart).
export default function TeacherDashboardShell({
  user,
  orgsOwned,
  orgsMember,
  myQuestions,
  tasksByOrg,
  notices,
  stats,
  activity,
  tasksChart,
}: any) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column: user greeting + orgs + notices */}
      <aside className="col-span-1 space-y-4">
        {/* User greeting card */}
        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h2 className="text-lg font-semibold mb-2">Hello, {user.displayName}</h2>
          <p className="text-sm text-muted">Welcome to your teacher dashboard.</p>
        </div>

        {/* Organizations card: shows orgs owned and member orgs */}
        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-sm font-semibold mb-3">Your Organizations</h3>
          <OrgList orgsOwned={orgsOwned} orgsMember={orgsMember} />
        </div>

        {/* Recent notices from member organizations */}
        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-sm font-semibold mb-3">Recent Notices</h3>
          <NoticesList notices={notices} />
        </div>
      </aside>

      {/* Center + right column: questions + tasks */}
      <section className="col-span-1 lg:col-span-2 space-y-4">
        {/* My questions: lists recent questions created by this teacher */}
        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-lg font-semibold mb-3">My Questions</h3>
          <MyQuestionsList questions={myQuestions} />
        </div>

        {/* Tasks overview: stats, bar chart, and per-org task breakdown */}
        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-lg font-semibold mb-3">Tasks</h3>
          {/* Quick stat pills: pending, in-progress, submitted, done, rejected */}
          <TaskStats stats={stats} />
          {/* Bar chart: visual count of tasks by status */}
          <div className="mt-4">
            <TasksChart labels={tasksChart.labels} data={tasksChart.data} />
          </div>
          {/* Tasks grouped by organization */}
          <div className="mt-6">
            <TasksByOrg tasksByOrg={tasksByOrg} />
          </div>
        </div>
      </section>

      {/* Full-width bottom section: Activity pie chart */}
      <div className="col-span-1 lg:col-span-3">
        <div className="rounded-2xl p-4 bg-card border border-white/5">
          <h3 className="text-lg font-semibold mb-3">Activity</h3>
          {/* Pie chart showing breakdown: questions created, comments, likes, notices posted */}
          <ActivityPieChart data={activity} />
        </div>
      </div>
    </div>
  );
}
