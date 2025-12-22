import React, { useState } from "react";
import { validateGdc, createPaymentOrder } from "../api/paymentsApi";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [gdcNumber, setGdcNumber] = useState("");
  const [amount, setAmount] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectType = (type) => {
    setPaymentType(type);
    setGdcNumber("");
    setAmount(null);
    setError("");
    setStep(1);
  };

  const proceedToPay = async () => {
    if (!gdcNumber.trim()) {
      setError("Please enter GDC number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await validateGdc({
        gdcNumber,
        type: paymentType,
      });

      setAmount(res.amount);
      setStep(2);

    } catch (err) {
      setError(err?.response?.data?.message || "Invalid GDC number");
    } finally {
      setLoading(false);
    }
  };

  const openRazorpay = async () => {
    try {
      setLoading(true);

      const response = await createPaymentOrder({
        gdcNumber,
        type: paymentType,
      });

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: response.key,
        order_id: response.orderId,
        amount: response.amount,
        currency: response.currency,
        name: "WTL Payments",
        description: `${paymentType} GDC Activation`,
        handler: function () {
          alert("Payment successful!");
        },
        theme: { color: "#2563eb" },
      };

      new window.Razorpay(options).open();

    } catch (err) {
      alert(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-2xl mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-3">
        💳 Payments
      </h2>

      {/* STEP 0 */}
      {step === 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div
            onClick={() => selectType("DRIVER")}
            className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-2xl cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-blue-50 to-white"
          >
            <span className="text-4xl mb-3">🚚</span>
            <h3 className="font-semibold text-lg">Driver Payment</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              Pay & activate Driver GDC
            </p>
          </div>

          <div
            onClick={() => selectType("TRANSPORTER")}
            className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-2xl cursor-pointer hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-green-50 to-white"
          >
            <span className="text-4xl mb-3">🏢</span>
            <h3 className="font-semibold text-lg">Transporter Payment</h3>
            <p className="text-sm text-gray-500 text-center mt-1">
              Pay & activate Transporter GDC
            </p>
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="mt-6 space-y-6">
          <button
            onClick={() => setStep(0)}
            className="text-blue-600 hover:underline"
          >
            ← Back
          </button>

          <h4 className="text-xl font-semibold">
            Enter {paymentType} GDC Number
          </h4>

          <input
            value={gdcNumber}
            onChange={(e) => setGdcNumber(e.target.value)}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter GDC Number"
          />

          {error && <p className="text-red-600 font-medium">{error}</p>}

          <button
            onClick={proceedToPay}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors duration-300"
          >
            {loading ? "Checking..." : "Proceed"}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="mt-6 space-y-6">
          <button
            onClick={() => setStep(1)}
            className="text-blue-600 hover:underline"
          >
            ← Back
          </button>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
            <p className="text-gray-700"><b>Type:</b> {paymentType}</p>
            <p className="text-gray-700"><b>GDC:</b> {gdcNumber}</p>
            <p className="text-gray-800 text-lg font-semibold">
              <b>Amount:</b> ₹{amount}
            </p>
          </div>

          <button
            onClick={openRazorpay}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
}
