// src/components/DashboardCard.jsx
import React from "react";

export default function DashboardCard({ title, value, icon, color = "green" }) {
  const colorMap = {
    green: "border-green-400 text-green-700",
    cyan: "border-cyan-400 text-cyan-700",
    amber: "border-amber-400 text-amber-700",
  };
  return (
    <div className={`bg-white rounded-2xl shadow p-5 border-t-4 ${colorMap[color]}`}>
      <div className="flex justify-between items-center">
        <div>
          <div className="text-xs text-gray-500">{title}</div>
          <div className="text-2xl font-bold mt-1">{value}</div>
        </div>
        <div className="text-2xl text-gray-300">{icon}</div>
      </div>
    </div>
  );
}
