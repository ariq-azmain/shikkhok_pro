"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ActivityPieChart({ data }: any) {
  const labels = ["Questions", "Comments", "Likes", "Notices"];
  const values = [
    data.questionsCreated ?? 0,
    data.commentsMade ?? 0,
    data.likesMade ?? 0,
    data.noticesPosted ?? 0,
  ];

  const chartData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: ["#6366f1", "#f59e0b", "#06b6d4", "#10b981"],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
  };

  return (
    <div style={{ height: 260 }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
