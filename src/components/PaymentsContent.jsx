import React, { useState } from "react";
import { createPaymentOrder } from "../api/paymentsApi";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [gdcNumber, setGdcNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const PAYMENT_AMOUNT = 500;

  const selectType = (type) => {
    setPaymentType(type);
    setStep(1);
    setError("");
  };

  const proceedToPay = () => {
    if (!gdcNumber.trim()) {
      setError("Please enter GDC number");
      return;
    }
    setStep(2);
  };

  const openRazorpay = async () => {
    try {
      setLoading(true);

      const orderResponse = await createPaymentOrder({
        amount: PAYMENT_AMOUNT,
        type: paymentType,
        gdc_number: gdcNumber,
      });

      const options = {
        key: orderResponse.keyId,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        order_id: orderResponse.orderId,
        name: "WTL Payments",
        description: `${paymentType} GDC Activation`,
        handler: function () {
          alert("Payment successful!");
        },
        prefill: {
          name: "WTL User",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Payments</h2>

      {step === 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div
            onClick={() => selectType("DRIVER")}
            className="p-6 border border-gray-200 rounded-xl cursor-pointer hover:shadow-lg transition duration-200 flex flex-col items-start gap-2"
          >
            <span className="text-3xl">🚚</span>
            <h3 className="font-semibold text-lg text-gray-800">Driver Payment</h3>
            <p className="text-gray-500 text-sm">Pay & activate Driver GDC</p>
          </div>

          <div
            onClick={() => selectType("TRANSPORTER")}
            className="p-6 border border-gray-200 rounded-xl cursor-pointer hover:shadow-lg transition duration-200 flex flex-col items-start gap-2"
          >
            <span className="text-3xl">🏢</span>
            <h3 className="font-semibold text-lg text-gray-800">Transporter Payment</h3>
            <p className="text-gray-500 text-sm">Pay & activate Transporter GDC</p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-4">
          <button
            onClick={() => setStep(0)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back
          </button>

          <h4 className="text-lg font-semibold">Enter {paymentType} GDC Number</h4>

          <input
            type="text"
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={gdcNumber}
            onChange={(e) => setGdcNumber(e.target.value)}
            placeholder="Enter GDC Number"
          />

          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}

          <button
            onClick={proceedToPay}
            className="w-full mt-4 px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          >
            Proceed to Pay
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-3">
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back
          </button>

          <h4 className="text-lg font-semibold">Payment Summary</h4>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <p><span className="font-semibold">Type:</span> {paymentType}</p>
            <p><span className="font-semibold">GDC Number:</span> {gdcNumber}</p>
            <p><span className="font-semibold">Amount:</span> ₹{PAYMENT_AMOUNT}</p>
          </div>

          <button
            onClick={openRazorpay}
            disabled={loading}
            className={`w-full mt-4 px-5 py-2 font-medium rounded-lg text-white ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } transition`}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
}
