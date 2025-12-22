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

  // 🔹 STEP 1 → STEP 2 (VALIDATE GDC)
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

      setAmount(res.amount); // backend decides amount
      setStep(2);

    } catch (err) {
      setError(err?.response?.data?.message || "Invalid GDC number");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 FINAL STEP (CREATE ORDER + OPEN RAZORPAY)
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
        theme: {
          color: "#2563eb",
        },
      };

      new window.Razorpay(options).open();

    } catch (err) {
      alert(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Payments
      </h2>

      {/* STEP 0 */}
      {step === 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div
            onClick={() => selectType("DRIVER")}
            className="p-6 border rounded-xl cursor-pointer hover:shadow-lg"
          >
            🚚 <h3 className="font-semibold">Driver Payment</h3>
            <p className="text-sm text-gray-500">Pay & activate Driver GDC</p>
          </div>

          <div
            onClick={() => selectType("TRANSPORTER")}
            className="p-6 border rounded-xl cursor-pointer hover:shadow-lg"
          >
            🏢 <h3 className="font-semibold">Transporter Payment</h3>
            <p className="text-sm text-gray-500">
              Pay & activate Transporter GDC
            </p>
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="mt-6 space-y-4">
          <button onClick={() => setStep(0)}>← Back</button>

          <h4 className="font-semibold">
            Enter {paymentType} GDC Number
          </h4>

          <input
            value={gdcNumber}
            onChange={(e) => setGdcNumber(e.target.value)}
            className="w-full p-3 border rounded"
            placeholder="Enter GDC Number"
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            onClick={proceedToPay}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Checking..." : "Proceed"}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="mt-6 space-y-4">
          <button onClick={() => setStep(1)}>← Back</button>

          <div className="bg-gray-50 p-4 rounded">
            <p><b>Type:</b> {paymentType}</p>
            <p><b>GDC:</b> {gdcNumber}</p>
            <p><b>Amount:</b> ₹{amount}</p>
          </div>

          <button
            onClick={openRazorpay}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
}
