import React, { useState } from "react";
import {
  createPaymentOrder,
  verifyPayment,
} from "../api/paymentsApi";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(""); // DRIVER / TRANSPORTER
  const [paymentType, setPaymentType] = useState(""); // REG / ADVANCE / SETTLEMENT
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
    setStep(1);
  };

  const selectPaymentType = (type) => {
    setPaymentType(type);
    setStep(2);
  };

  // ===============================
  // STEP 3: CREATE ORDER
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
        category,          // DRIVER / TRANSPORTER
        type: paymentType, // REG / ADVANCE / SETTLEMENT
      });

      if (!res?.order_id) {
        throw new Error("order_id missing from backend");
      }

      setOrderData(res);
      setAmount(res.amount / 100);
      setStep(3);

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
  // STEP 4: RAZORPAY
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
      description: `${category} - ${paymentType}`,

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

          alert("Payment successful!");
          resetFlow();

        } catch {
          alert("Payment verification failed");
        }
      },

      theme: { color: "#2563eb" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-2xl mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-3">
        💳 Payments
      </h2>

      {/* STEP 0: CATEGORY */}
      {step === 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div
            onClick={() => selectCategory("DRIVER")}
            className="p-8 border rounded-2xl cursor-pointer hover:shadow-lg"
          >
            🚚 Driver Payments
          </div>

          <div
            onClick={() => selectCategory("TRANSPORTER")}
            className="p-8 border rounded-2xl cursor-pointer hover:shadow-lg"
          >
            🏢 Transporter Payments
          </div>
        </div>
      )}

      {/* STEP 1: DRIVER TYPES */}
      {step === 1 && category === "DRIVER" && (
        <div className="space-y-4">
          <button
            onClick={() => selectPaymentType("DRIVER_REGISTRATION")}
            className="w-full p-4 border rounded-xl hover:bg-gray-50"
          >
            Driver Registration Fee
          </button>
        </div>
      )}

      {/* STEP 1: TRANSPORTER TYPES */}
      {step === 1 && category === "TRANSPORTER" && (
        <div className="space-y-4">
          <button
            onClick={() => selectPaymentType("TRANSPORTER_REGISTRATION")}
            className="w-full p-4 border rounded-xl hover:bg-gray-50"
          >
            Transporter Registration Fee
          </button>

          <button
            onClick={() => selectPaymentType("TRANSPORTER_ADVANCE")}
            className="w-full p-4 border rounded-xl hover:bg-gray-50"
          >
            Transporter Advance (Driver Assignment)
          </button>

          <button
            onClick={() => selectPaymentType("TRANSPORTER_MONTHLY_SETTLEMENT")}
            className="w-full p-4 border rounded-xl hover:bg-gray-50"
          >
            Transporter Monthly Settlement
          </button>
        </div>
      )}

      {/* STEP 2: GDC INPUT */}
      {step === 2 && (
        <div className="space-y-4">
          <input
            value={gdcRegistrationNumber}
            onChange={(e) => setGdcRegistrationNumber(e.target.value)}
            placeholder="Enter GDC Registration Number"
            className="w-full p-3 border rounded-xl"
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            onClick={proceedToPay}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {loading ? "Checking..." : "Proceed"}
          </button>
        </div>
      )}

      {/* STEP 3: CONFIRM */}
      {step === 3 && (
        <div className="space-y-4">
          <p><b>Category:</b> {category}</p>
          <p><b>Type:</b> {paymentType}</p>
          <p><b>GDC:</b> {gdcRegistrationNumber}</p>
          <p className="text-lg font-semibold">
            <b>Amount:</b> ₹{amount}
          </p>

          <button
            onClick={openRazorpay}
            className="w-full bg-green-600 text-white py-3 rounded-xl"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}
