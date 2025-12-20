// src/pages/admin/ReportsPage.jsx
import React from "react";
import SidebarLayout from "../components/SidebarLayout";
import dashboardApi from "../api/dashboardApi";

export default function ReportsPage() {
  // this UI provides quick export buttons and links to filtered report views
  const handleExportAll = async () => {
    const s = await dashboardApi.fetchSummary();
    // prepare a simple csv export (you can replace with XLSX)
    dashboardApi.exportCsv([
      { metric: "driverVisitors", value: s.driverVisitors },
      { metric: "transporterVisitors", value: s.transporterVisitors },
      { metric: "driverPaid", value: s.driverPaid },
      { metric: "transporterPaid", value: s.transporterPaid },
    ], "reports-summary.csv");
  };

  return (
    <SidebarLayout>
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow p-6 mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-blue-700">Reports</h2>
            <p className="text-sm text-gray-500 mt-1">Export driver, transporter, visitor and payment reports.</p>
          </div>

          <div className="flex gap-3">
            <button onClick={handleExportAll} className="bg-cyan-600 text-white px-4 py-2 rounded-lg">Export Summary</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Open Advanced Reports</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-3">Driver Reports</h3>
            <p className="text-sm text-gray-500">Download full driver lists, filter by date, vehicle and status.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold mb-3">Payments</h3>
            <p className="text-sm text-gray-500">Payment history, pending payments and reconciliation exports.</p>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
