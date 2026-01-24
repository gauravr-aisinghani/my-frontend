import React from "react";
import {
  Wallet,
  Users,
  Bell,
  IndianRupee,
  ClipboardList,
  CalendarCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function TransporterDashboard() {
  const navigate = useNavigate();
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Transporter Dashboard</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Wallet Balance" value="₹45,000" icon={<Wallet />} />
        <StatCard title="Active Drivers" value="18" icon={<Users />} />
        <StatCard title="Ledger Balance" value="₹12,500" icon={<IndianRupee />} />
        <StatCard title="Notifications" value="3" icon={<Bell />} />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Box title="Raise Driver Requirement">
          <p className="text-gray-600 mb-3">
            Need more drivers? Raise a requirement request.
          </p>
          <button
      onClick={() => navigate("/transporter/raise-driver-request")}
      className="px-4 py-2 bg-green-600 text-white rounded-lg"
    >
      Raise Request
    </button>
        </Box>

        <Box title="Attendance Overview">
          <div className="flex justify-between text-sm">
            <span>Total Drivers: 20</span>
            <span>Present: 16</span>
            <span>On Leave: 4</span>
          </div>
        </Box>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Box title="Payment History">
          <ul className="text-sm text-gray-700 space-y-2">
            <li>Driver A – ₹2,000 – Paid</li>
            <li>Driver B – ₹1,500 – Pending</li>
            <li>Driver C – ₹3,000 – Paid</li>
          </ul>
        </Box>

        <Box title="Driver Attendance & Ledger">
          <ul className="text-sm text-gray-700 space-y-2">
            <li>Driver A – 22 Days – ₹12,000</li>
            <li>Driver B – 18 Days – ₹9,000</li>
            <li>Driver C – 25 Days – ₹15,000</li>
          </ul>
        </Box>
      </div>
    </div>
  );
}

/* ---------- Reusable UI ---------- */

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
      <div className="text-green-600">{icon}</div>
    </div>
  );
}

function Box({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}
