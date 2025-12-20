// src/pages/admin/VehiclesPage.jsx
import React, { useEffect, useState } from "react";
import SidebarLayout from "../components/SidebarLayout";
import dashboardApi from "../api/dashboardApi";
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

export default function VehiclesPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      const s = await dashboardApi.fetchSummary();
      setStats(s);
    })();
  }, []);

  const vehiclePie = stats ? Object.entries(stats.vehiclesByType || {}).map(([k, v]) => ({ name: k, value: v })) : [];

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Vehicles Overview</h2>
          <p className="text-sm text-gray-500 mt-1">Totals, availability and vehicle-type breakdown.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2 bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Vehicle Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-500">Total Vehicles</div>
                <div className="text-xl font-bold">{stats?.totalVehicles ?? "—"}</div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-500">Available</div>
                <div className="text-xl font-bold">{stats?.availableVehicles ?? "—"}</div>
              </div>
              <div className="p-4 border rounded">
                <div className="text-sm text-gray-500">Assigned</div>
                <div className="text-xl font-bold">{stats?.assignedVehicles ?? "—"}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Vehicles by Type</h3>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={vehiclePie} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} label>
                    {vehiclePie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#16a34a","#0ea5e9","#f59e0b","#ef4444"][index%4]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
