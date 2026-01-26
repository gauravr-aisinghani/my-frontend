import React, { useEffect, useState } from "react";
import {
  Wallet,
  Users,
  Bell,
  CreditCard,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  createPaymentOrder,
  verifyPayment,
} from "../api/paymentsApi";
import api from "../api/axiosInstance";

export default function TransporterDashboard() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [showPayments, setShowPayments] = useState(false);
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const userContext = JSON.parse(
    localStorage.getItem("user_context") || "{}"
  );

  const mobile = userContext?.mobile;
  const gdc_number = userContext?.gdc_number;

  // ===== FETCH TRANSPORTER NOTIFICATIONS (ADMIN STYLE) =====
  const fetchNotifications = async () => {
    if (!mobile) return;

    try {
      const res = await api.get(
        `/api/notifications/transporter/${mobile}`
      );
      setNotifications(res.data || []);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [mobile]);

  // ===== PAYMENT HANDLER =====
  const handlePayment = async (purpose, amount = null) => {
    try {
      setLoading(true);

      const payload = {
        gdc_number,
        type: "TRANSPORTER",
        purpose,
      };

      if (amount) payload.amount = amount;

      const order = await createPaymentOrder(payload);

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Transporter Payments",
        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id:
              response.razorpay_payment_id,
            razorpay_signature:
              response.razorpay_signature,
          });

          alert("Payment successful ✅");
          setShowPayments(false);
          setShowTopup(false);
          setTopupAmount("");
        },
      };

      new window.Razorpay(options).open();
    } catch (e) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Transporter Dashboard
        </h1>

        {/* 🔔 NOTIFICATION BELL */}
        <div
          className="relative cursor-pointer"
          onClick={() =>
            navigate("/transporter/notifications")
          }
        >
          <Bell className="w-6 h-6 text-gray-700" />
          {notifications.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
              {notifications.length}
            </span>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Wallet Balance"
          value="₹45,000"
          icon={<Wallet />}
        />

        <StatCard
          title="Active Drivers"
          value="18"
          icon={<Users />}
        />

        <StatCard
          title="Notifications"
          value={notifications.length}
          icon={<Bell />}
          onClick={() =>
            navigate("/transporter/notifications")
          }
        />
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActionCard
          title="Raise Driver Requirement"
          desc="Need more drivers?"
          button="Raise Request"
          onClick={() =>
            navigate(
              "/transporter/raise-driver-request"
            )
          }
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
            onClick={() =>
              handlePayment("TRANSPORTER_ADVANCE")
            }
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
            onClick={() =>
              handlePayment("MONTHLY_SETTLEMENT")
            }
          />
        </Modal>
      )}

      {/* TOPUP MODAL */}
      {showTopup && (
        <Modal onClose={() => setShowTopup(false)}>
          <input
            type="number"
            value={topupAmount}
            onChange={(e) =>
              setTopupAmount(e.target.value)
            }
            className="w-full border p-3 rounded-lg mb-4"
            placeholder="Enter amount"
          />
          <button
            disabled={!topupAmount || loading}
            onClick={() =>
              handlePayment(
                "MANUAL_TOPUP",
                Number(topupAmount)
              )
            }
            className="w-full bg-green-600 text-white py-3 rounded-xl"
          >
            Pay ₹{topupAmount || 0}
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ===== UI HELPERS ===== */

function StatCard({ title, value, icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl p-5 flex justify-between items-center border"
    >
      <div>
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <p className="text-2xl font-bold">
          {value}
        </p>
      </div>
      <div className="bg-green-100 p-3 rounded-xl text-green-600">
        {icon}
      </div>
    </div>
  );
}

function ActionCard({
  title,
  desc,
  button,
  onClick,
  icon,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border">
      <div className="flex gap-2 mb-2">
        {icon}
        <h2 className="font-semibold">
          {title}
        </h2>
      </div>
      <p className="text-sm text-gray-600">
        {desc}
      </p>
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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl p-5">
        <div className="flex justify-end mb-4">
          <X
            className="cursor-pointer"
            onClick={onClose}
          />
        </div>
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

function PaymentOption({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full border rounded-xl py-3 px-4 text-left"
    >
      {text}
    </button>
  );
}
