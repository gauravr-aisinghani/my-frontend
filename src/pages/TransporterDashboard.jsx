import React, { useEffect, useState } from "react";
import {
  Wallet,
  Users,
  CreditCard,
  X,
  Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import { createPaymentOrder, verifyPayment } from "../api/paymentsApi";

export default function TransporterDashboard() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [showPayments, setShowPayments] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const userContext = JSON.parse(localStorage.getItem("user_context") || "{}");

  const mobile = userContext?.user_id;
  const gdc = userContext?.gdc_number;

  // ================= WALLET =================
  const fetchWallet = async () => {
    try {
      const res = await api.get(`/api/wallets/${gdc}/TRANSPORTER`);
      setWalletBalance(res.data.balance || 0);
    } catch (e) {
      console.error(e);
    }
  };

  // ================= NOTIFICATIONS =================
  const fetchNotifications = async () => {
    if (!mobile) return;
    try {
      const res = await api.get(`/api/notifications/transporter/${mobile}`);
      setNotifications(res.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchWallet();
    fetchNotifications();
  }, [mobile]);

  // ================= PAYMENTS =================
  const handlePayment = async (purpose, amount = null) => {
    try {
      setLoading(true);

      const payload = {
        gdc_number: gdc,
        type: "TRANSPORTER",
        purpose
      };
      if (amount) payload.amount = amount;

      const order = await createPaymentOrder(payload);

      // ✅ NO RESPONSE HANDLING
      if (!order || !order.order_id) {
        if (purpose === "MONTHLY_SETTLEMENT") {
          alert("No pending monthly settlement ❌");
        } else if (purpose === "TRANSPORTER_ADVANCE") {
          alert("No advance pending right now ❌");
        } else {
          alert("No payment available ❌");
        }
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Transporter Wallet",
        handler: async (res) => {
          await verifyPayment(res);
          alert("Payment successful ✅");

          setShowPayments(false);
          setShowTopup(false);
          setTopupAmount("");

          fetchWallet(); // refresh balance
        }
      };

      new window.Razorpay(options).open();
    } catch (e) {
      console.error(e);
      alert("Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Transporter Dashboard</h1>

        {/* 🔔 Notification Icon */}
        <div
          onClick={() => navigate("/transporter-notification")}
          className="relative cursor-pointer"
        >
          <Bell size={26} />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Wallet Balance"
          value={`₹${walletBalance}`}
          icon={<Wallet />}
          onClick={() => navigate("/transporter/wallet")}
        />

        <StatCard title="Active Drivers" value="18" icon={<Users />} />

        <StatCard
          title="Notifications"
          value={notifications.length}
          icon={<Bell />}
          onClick={() => navigate("/transporter-notification")}
        />
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          title="Raise Driver Requirement"
          desc="Need more drivers?"
          button="Raise Request"
          onClick={() => navigate("/transporter/raise-driver-request")}
        />

        <ActionCard
          title="Payments"
          desc="Advance, wallet & settlement"
          button="Open Payments"
          icon={<CreditCard />}
          onClick={() => setShowPayments(true)}
        />
      </div>

      {/* PAYMENTS MODAL */}
      {showPayments && (
        <Modal onClose={() => setShowPayments(false)}>
          <PaymentOption
            text="Make driver advance"
            onClick={() => handlePayment("TRANSPORTER_ADVANCE")}
          />
          <PaymentOption
            text="Add to wallet"
            onClick={() => {
              setShowPayments(false);
              setShowTopup(true);
            }}
          />
          <PaymentOption
            text="Monthly settlement"
            onClick={() => handlePayment("MONTHLY_SETTLEMENT")}
          />
        </Modal>
      )}

      {/* TOPUP MODAL */}
      {showTopup && (
        <Modal onClose={() => setShowTopup(false)}>
          <input
            type="number"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="Enter amount"
          />

          <button
            disabled={!topupAmount || loading}
            onClick={() =>
              handlePayment("MANUAL_TOPUP", Number(topupAmount))
            }
            className="w-full bg-green-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            Pay ₹{topupAmount || 0}
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ================= UI ================= */

function StatCard({ title, value, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl p-5 flex justify-between items-center border"
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {icon && (
        <div className="bg-green-100 p-3 rounded-xl text-green-600">
          {icon}
        </div>
      )}
    </div>
  );
}

function ActionCard({ title, desc, button, onClick, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border">
      <div className="flex gap-2 mb-2 items-center">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <p className="text-sm text-gray-600">{desc}</p>
      <button
        onClick={onClick}
        className="mt-5 w-full bg-green-600 text-white py-2.5 rounded-xl"
      >
        {button}
      </button>
    </div>
  );
}

function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-5">
        <div className="flex justify-end mb-4">
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

function PaymentOption({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-green-600 text-white rounded-xl py-3 px-4 text-left hover:bg-green-700"
    >
      {text}
    </button>
  );
}
