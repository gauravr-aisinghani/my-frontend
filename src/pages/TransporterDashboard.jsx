import React, { useState } from "react";
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

export default function TransporterDashboard() {
  const navigate = useNavigate();

  const [showWallet, setShowWallet] = useState(false);
  const [showPayments, setShowPayments] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW STATES (TOPUP)
  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");

  const userContext = JSON.parse(
    localStorage.getItem("user_context") || "{}"
  );

  const gdc_number = userContext.gdc_number;
  const type = "TRANSPORTER";

  // ===============================
  // PAYMENT HANDLER (BACKEND SYNC)
  // ===============================
  const handlePayment = async (purpose, amount = null) => {
    try {
      setLoading(true);

      // 🔥 backend decides amount (except MANUAL_TOPUP)
      const order = await createPaymentOrder({
        gdc_number,
        type,
        purpose,
        ...(amount && { amount }),
      });

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Transporter Payments",
        description: purpose.replace("_", " "),
        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Payment Successful ✅");
          setShowPayments(false);
          setShowTopup(false);
          setTopupAmount("");
        },
        theme: { color: "#16a34a" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        Transporter Dashboard
      </h1>

      {/* ===== TOP STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Wallet Balance"
          value="₹45,000"
          icon={<Wallet />}
          onClick={() => setShowWallet(true)}
          highlight
        />
        <StatCard title="Active Drivers" value="18" icon={<Users />} />
        <StatCard title="Notifications" value="3" icon={<Bell />} />
      </div>

      {/* ===== MAIN ACTIONS ===== */}
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
          highlight
        />
      </div>

      {/* ===== PAYMENTS MODAL ===== */}
      {showPayments && (
        <Modal title="Payments" onClose={() => setShowPayments(false)}>
          <div className="space-y-3">
            <PaymentOption
              text="Make advance for driver"
              onClick={() => handlePayment("TRANSPORTER_ADVANCE")}
              disabled={loading}
            />

            <PaymentOption
              text="Add to your wallet"
              onClick={() => {
                setShowPayments(false);
                setShowTopup(true);
              }}
              disabled={loading}
            />

            <PaymentOption
              text="Monthly settlement"
              onClick={() => handlePayment("MONTHLY_SETTLEMENT")}
              disabled={loading}
            />
          </div>
        </Modal>
      )}

      {/* ===== TOPUP MODAL ===== */}
      {showTopup && (
        <Modal title="Add Money to Wallet" onClose={() => setShowTopup(false)}>
          <input
            type="number"
            placeholder="Enter amount"
            value={topupAmount}
            onChange={(e) => setTopupAmount(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          />

          <button
            onClick={() =>
              handlePayment("MANUAL_TOPUP", Number(topupAmount))
            }
            disabled={!topupAmount || loading}
            className="w-full bg-green-600 text-white py-3 rounded-xl disabled:opacity-50"
          >
            Pay ₹{topupAmount || 0}
          </button>
        </Modal>
      )}
    </div>
  );
}

/* ===== SAME COMPONENTS (UNCHANGED) ===== */

function StatCard({ title, value, icon, onClick, highlight }) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-2xl p-5 flex justify-between items-center
      border transition hover:shadow-lg
      ${highlight ? "border-green-500" : "border-gray-200"}`}
    >
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
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
  children,
  icon,
  highlight,
}) {
  return (
    <div
      className={`bg-white rounded-2xl p-5 border transition hover:shadow-lg
      ${highlight ? "border-green-500" : "border-gray-200"}`}
    >
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-green-600">{icon}</div>}
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>

      <p className="text-sm text-gray-600">{desc}</p>

      {children}

      {button && (
        <button
          onClick={onClick}
          className="mt-5 w-full bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 transition"
        >
          {button}
        </button>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-lg">{title}</h2>
          <X
            className="cursor-pointer text-gray-600 hover:text-black"
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>
  );
}

function PaymentOption({ text, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full border border-gray-200 rounded-xl py-3 px-4 text-left
      hover:bg-green-50 transition disabled:opacity-50"
    >
      {text}
    </button>
  );
}
