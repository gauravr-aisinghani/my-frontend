import React, { useState } from "react";
import { createPaymentOrder } from "../api/paymentsApi";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [gdcNumber, setGdcNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);

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

      // 🔹 Call backend (NO amount, NO gdc_number)
      const response = await createPaymentOrder({
        gdcNumber: gdcNumber,
        type: paymentType,
      });

      console.log("Create order response:", response);
      setOrderData(response);

      if (!window.Razorpay) {
        alert("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: response.key,            // ✅ correct
        order_id: response.orderId,   // ✅ correct
        amount: response.amount,      // paise
        currency: response.currency,
        name: "WTL",
        description: `${paymentType} GDC Activation`,

        handler: function (res) {
          console.log("Payment success:", res);
          alert("Payment successful!");
          // next step: call verify-payment API
        },

        modal: {
          ondismiss: function () {
            console.log("Payment popup closed");
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert(response.error.description);
      });

      rzp.open();

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Payments
      </h2>

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

          <button onClick={proceedToPay} className="btn-primary">
            Proceed to Pay
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-3">
          <button onClick={() => setStep(1)}>← Back</button>

          <h4 className="font-semibold">Payment Summary</h4>
          <p><b>Type:</b> {paymentType}</p>
          <p><b>GDC:</b> {gdcNumber}</p>
          {orderData && (
            <p>
              <b>Amount:</b> ₹{orderData.amount / 100}
            </p>
          )}

          <button
            onClick={openRazorpay}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
}
