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
import {
  getTransporterNotifications,
} from "../api/transporterNotificationApi";

export default function TransporterDashboard() {
  const navigate = useNavigate();

  const [showPayments, setShowPayments] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showTopup, setShowTopup] = useState(false);
  const [topupAmount, setTopupAmount] = useState("");

  // 🔔 notifications
  const [notifications, setNotifications] = useState([]);

  const userContext = JSON.parse(
    localStorage.getItem("user_context") || "{}"
  );

  const gdc_number = userContext?.gdc_number;
  const type = "TRANSPORTER";

  // ===== fetch notifications =====
  useEffect(() => {
    if (!gdc_number) return;

    getTransporterNotifications(gdc_number)
      .then((data) => setNotifications(data || []))
      .catch((err) =>
        console.error("Notification fetch failed", err)
      );
  }, [gdc_number]);

  // ===== payment handler =====
  const handlePayment = async (purpose, amount = null) => {
    if (!gdc_number) {
      alert("GDC missing. Login again.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        gdc_number,
        type,
        purpose,
      };

      if (amount !== null) payload.amount = amount;

      const order = await createPaymentOrder(payload);

      if (!order?.order_id) {
        alert("Order ID missing");
        return;
      }

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Transporter Payments",
        description: purpose.replaceAll("_", " "),
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
      };

      new window.Razorpay(options).open();
    } catch (err) {
      alert("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">
        Transporter Dashboard
      </h1>

      {/* TOP STATS */}
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
            navigate("/transporter/raise-driver-request")
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
        <Modal
          title="Payments"
          onClose={() => setShowPayments(false)}
        >
          <PaymentOption
            text="Make advance for driver"
            disabled={loading}
            onClick={() =>
              handlePayment("TRANSPORTER_ADVANCE")
            }
          />

          <PaymentOption
            text="Add to wallet"
            disabled={loading}
            onClick={() => {
              setShowPayments(false);
              setShowTopup(true);
            }}
          />

          <PaymentOption
            text="Monthly settlement"
            disabled={loading}
            onClick={() =>
              handlePayment("MONTHLY_SETTLEMENT")
            }
          />
        </Modal>
      )}

      {/* TOPUP MODAL */}
      {showTopup && (
        <Modal
          title="Add Wallet Amount"
          onClose={() => setShowTopup(false)}
        >
          <input
            type="number"
            placeholder="Enter amount"
            value={topupAmount}
            onChange={(e) =>
              setTopupAmount(e.target.value)
            }
            className="w-full border p-3 mb-4 rounded-lg"
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

/* ===== UI ===== */

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
      <div className="bg-green-100 p-3 rounded-xl text-green-600">
        {icon}
      </div>
    </div>
  );
}

function ActionCard({ title, desc, button, onClick, icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 border">
      <div className="flex gap-2 mb-2">
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

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl p-5">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">{title}</h2>
          <X
            onClick={onClose}
            className="cursor-pointer"
          />
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

function PaymentOption({ text, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full border rounded-xl py-3 px-4 text-left"
    >
      {text}
    </button>
  );
}
