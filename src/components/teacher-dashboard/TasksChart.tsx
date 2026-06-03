"use client";

import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function TasksChart({ labels, data }: any) {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Tasks by status",
        data,
        backgroundColor: ["#f59e0b", "#06b6d4", "#60a5fa", "#10b981", "#ef4444"],
      },
    ],
  };

  return <Bar data={chartData} />;
}
