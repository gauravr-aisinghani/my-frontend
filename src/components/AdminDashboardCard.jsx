import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboardCard = ({ title, gradient, rows }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-200">
      <div className={`p-4 bg-gradient-to-r ${gradient} text-white`}>
        <h2 className="text-lg font-bold tracking-wide">{title}</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {rows.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-between w-full text-left px-6 py-4 hover:bg-gray-50 transition-all"
          >
            <span className="flex items-center gap-3 text-gray-700 font-medium">
              {item.icon} {item.label}
            </span>
            <span className="text-blue-600 font-semibold hover:underline">
              View →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardCard;
