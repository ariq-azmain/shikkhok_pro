"use client";

import React from "react";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function TasksChart({ labels, data }: any) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Tasks by status",
        data,
        backgroundColor: [
          "#f59e0b",
          "#06b6d4",
          "#60a5fa",
          "#10b981",
          "#ef4444",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index" },
    },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ height: 240 }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
