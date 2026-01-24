// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import NotificationBell from "../components/NotificationBell";
import dashboardApi from "../api/dashboardApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#16a34a", "#0ea5e9", "#f59e0b", "#ef4444"];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await dashboardApi.fetchSummary();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const barData = stats
    ? [
        { name: "Driver Visitors", value: stats.driverVisitors },
        { name: "Transporter Visitors", value: stats.transporterVisitors },
        { name: "Driver Paid", value: stats.driverPaid },
        { name: "Transporter Paid", value: stats.transporterPaid },
      ]
    : [];

  const pieData = stats
    ? [
        { name: "Paid", value: stats.driverPaid + stats.transporterPaid },
        { name: "Pending", value: stats.pendingPayments || 0 },
      ]
    : [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Top header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <NotificationBell adminId={"ADMIN"} /> {/* bell top right */}
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <DashboardCard title="Driver Visitors" value={stats?.driverVisitors ?? "—"} icon="📥" color="green" />
        <DashboardCard title="Transporter Visitors" value={stats?.transporterVisitors ?? "—"} icon="🚚" color="cyan" />
        <DashboardCard title="Payments Completed" value={stats ? stats.driverPaid + stats.transporterPaid : "—"} icon="💳" color="amber" />
        <DashboardCard title="Total Vehicles" value={stats?.totalVehicles ?? "—"} icon="🚛" color="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Visitors & Payments Overview</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value">
                  {barData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold mb-3">Payments Overview</h3>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={90} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
