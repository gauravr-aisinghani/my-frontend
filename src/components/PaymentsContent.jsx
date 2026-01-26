import React, { useState } from "react";
import {
  createPaymentOrder,
  verifyPayment,
} from "../api/paymentsApi";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(""); // DRIVER / TRANSPORTER
  const [paymentType, setPaymentType] = useState(""); // DRIVER / TRANSPORTER
  const [gdcRegistrationNumber, setGdcRegistrationNumber] = useState("");
  const [amount, setAmount] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const resetFlow = () => {
    setStep(0);
    setCategory("");
    setPaymentType("");
    setGdcRegistrationNumber("");
    setAmount(null);
    setOrderData(null);
    setError("");
  };

  const selectCategory = (cat) => {
    resetFlow();
    setCategory(cat);

    // ✅ BACKEND-COMPATIBLE ENUM
    setPaymentType(cat); // DRIVER or TRANSPORTER

    setStep(1);
  };

  // ===============================
  // CREATE ORDER
  // ===============================
  const proceedToPay = async () => {
    if (!gdcRegistrationNumber.trim()) {
      setError("Please enter GDC registration number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await createPaymentOrder({
        gdc_number: gdcRegistrationNumber.trim(),
        category,      // DRIVER / TRANSPORTER
        type: paymentType, // ✅ DRIVER / TRANSPORTER
      });

      if (!res?.order_id) {
        throw new Error("order_id missing from backend");
      }

      setOrderData(res);
      setAmount(res.amount / 100);
      setStep(2);

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to create payment order"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RAZORPAY
  // ===============================
  const openRazorpay = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    const options = {
      key: orderData.key,
      order_id: orderData.order_id,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "WTL Payments",
      description: `${category} Registration Fee`,

      handler: async function (response) {
        try {
          const res = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (res.status !== "SUCCESS") {
            alert(res.message || "Verification failed");
            return;
          }

          alert("✅ Payment successful!");
          resetFlow();

        } catch {
          alert("❌ Payment verification failed");
        }
      },

      theme: { color: "#0f172a" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl mt-12">
      <h2 className="text-3xl font-bold text-slate-800 mb-10 border-b pb-4">
        💳 Payments
      </h2>

      {/* STEP 0: CATEGORY */}
      {step === 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div
            onClick={() => selectCategory("DRIVER")}
            className="p-8 rounded-2xl cursor-pointer
              bg-gradient-to-br from-blue-600 to-blue-700
              text-white font-semibold text-lg
              hover:scale-105 transition-transform shadow-lg"
          >
            🚚 Driver Registration Fee
          </div>

          <div
            onClick={() => selectCategory("TRANSPORTER")}
            className="p-8 rounded-2xl cursor-pointer
              bg-gradient-to-br from-emerald-600 to-emerald-700
              text-white font-semibold text-lg
              hover:scale-105 transition-transform shadow-lg"
          >
            🏢 Transporter Registration Fee
          </div>
        </div>
      )}

      {/* STEP 1: GDC INPUT */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="text-lg font-semibold text-slate-700">
            {category === "DRIVER"
              ? "Driver Registration Fee"
              : "Transporter Registration Fee"}
          </div>

          <input
            value={gdcRegistrationNumber}
            onChange={(e) => setGdcRegistrationNumber(e.target.value)}
            placeholder="Enter GDC Registration Number"
            className="w-full p-4 border rounded-xl
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            onClick={proceedToPay}
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl
              hover:bg-slate-800 transition disabled:opacity-60"
          >
            {loading ? "Checking..." : "Continue"}
          </button>
        </div>
      )}

      {/* STEP 2: CONFIRM */}
      {step === 2 && (
        <div className="space-y-4">
          <p><b>Category:</b> {category}</p>
          <p><b>GDC:</b> {gdcRegistrationNumber}</p>
          <p className="text-xl font-bold text-slate-800">
            Amount: ₹{amount}
          </p>

          <button
            onClick={openRazorpay}
            className="w-full bg-green-600 text-white py-3 rounded-xl
              hover:bg-green-700 transition"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}
