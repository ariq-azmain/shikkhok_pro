"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ActivityPieChart({ data }: any) {
  const labels = ["Questions", "Comments", "Likes", "Notices"];
  const values = [
    data?.questionsCreated ?? 0,
    data?.commentsMade ?? 0,
    data?.likesMade ?? 0,
    data?.noticesPosted ?? 0,
  ];

  // Check if all values are 0
  const hasData = values.some((v) => v > 0);

  // If no data, show placeholder
  if (!hasData) {
    return (
      <div
        style={{ height: 260 }}
        className="flex items-center justify-center text-[var(--text-muted)]"
      >
        <div className="text-center">
          <p className="text-sm">No activity yet</p>
          <p className="text-xs mt-1">Create questions, comment, or like to see activity</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#6366f1", "#f59e0b", "#06b6d4", "#10b981"],
        borderColor: ["#4f46e5", "#d97706", "#0891b2", "#059669"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.parsed}`;
          },
        },
      },
    },
  };

  return (
    <div style={{ height: 260 }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
