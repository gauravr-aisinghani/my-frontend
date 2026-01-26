import React, { useState } from "react";
import {
  Wallet,
  Users,
  Bell,
  IndianRupee,
  CreditCard,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TransporterDashboard() {
  const navigate = useNavigate();

  const [showWallet, setShowWallet] = useState(false);
  const [showPayments, setShowPayments] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Transporter Dashboard
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Wallet Balance"
          value="₹45,000"
          icon={<Wallet />}
          onClick={() => setShowWallet(true)}
          highlight
        />
        <StatCard title="Active Drivers" value="18" icon={<Users />} />
        <StatCard title="Ledger Balance" value="₹12,500" icon={<IndianRupee />} />
        <StatCard title="Notifications" value="3" icon={<Bell />} />
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ActionCard
          title="Raise Driver Requirement"
          desc="Need more drivers? Raise a requirement request."
          button="Raise Request"
          onClick={() => navigate("/transporter/raise-driver-request")}
        />

        <ActionCard
          title="Payments"
          desc="Manage advances, wallet & settlements"
          button="Open Payments"
          onClick={() => setShowPayments(true)}
          icon={<CreditCard />}
        />

        <ActionCard
          title="Attendance Overview"
          desc="Track driver attendance & availability"
        >
          <div className="text-sm text-gray-600 mt-2 flex justify-between">
            <span>Total: 20</span>
            <span className="text-green-600">Present: 16</span>
            <span className="text-red-500">Leave: 4</span>
          </div>
        </ActionCard>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoBox title="Recent Payments">
          <li>Driver A – ₹2,000 – Paid</li>
          <li>Driver B – ₹1,500 – Pending</li>
          <li>Driver C – ₹3,000 – Paid</li>
        </InfoBox>

        <InfoBox title="Driver Ledger">
          <li>Driver A – 22 Days – ₹12,000</li>
          <li>Driver B – 18 Days – ₹9,000</li>
          <li>Driver C – 25 Days – ₹15,000</li>
        </InfoBox>
      </div>

      {/* Wallet Modal */}
      {showWallet && (
        <Modal title="Wallet Overview" onClose={() => setShowWallet(false)}>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-xl text-center">
              <p className="text-sm text-gray-500">Available Balance</p>
              <p className="text-3xl font-bold text-green-600">₹45,000</p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                Add Money
              </button>
              <button className="flex-1 border border-green-600 text-green-600 py-2 rounded-lg">
                View Ledger
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Payments Modal */}
      {showPayments && (
        <Modal title="Payments" onClose={() => setShowPayments(false)}>
          <div className="space-y-3">
            <PaymentOption text="Make advance for driver" />
            <PaymentOption text="Add to your wallet" />
            <PaymentOption text="Monthly settlement" />
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Components ---------- */

function StatCard({ title, value, icon, onClick, highlight }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-2xl shadow p-5 flex justify-between items-center hover:shadow-lg transition
      ${highlight ? "border-2 border-green-500" : ""}`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="bg-green-100 p-3 rounded-xl text-green-600">
        {icon}
      </div>
    </div>
  );
}

function ActionCard({ title, desc, button, onClick, children, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-green-600">{icon}</div>}
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <p className="text-sm text-gray-600">{desc}</p>

      {children}

      {button && (
        <button
          onClick={onClick}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          {button}
        </button>
      )}
    </div>
  );
}

function InfoBox({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow p-5">
      <h2 className="font-semibold mb-3">{title}</h2>
      <ul className="text-sm text-gray-700 space-y-2">{children}</ul>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

function PaymentOption({ text }) {
  return (
    <button className="w-full border rounded-xl py-3 text-left px-4 hover:bg-green-50">
      {text}
    </button>
  );
}
