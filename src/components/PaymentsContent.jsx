import React, { useState } from "react";
import { createPaymentOrder } from "../api/paymentsApi";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [gdcNumber, setGdcNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectType = (type) => {
    console.log("👉 Payment type selected:", type);
    setPaymentType(type);
    setStep(1);
    setError("");
  };

  const proceedToPay = () => {
    console.log("👉 Proceed clicked with GDC:", gdcNumber);

    if (!gdcNumber.trim()) {
      setError("Please enter GDC number");
      return;
    }
    setStep(2);
  };

  const openRazorpay = async () => {
    console.log("🔥 Pay Now clicked");

    try {
      setLoading(true);

      console.log("📡 Calling backend...");
      const response = await createPaymentOrder({
        gdcNumber: gdcNumber,
        type: paymentType,
      });

      console.log("✅ Order created:", response);

      if (!window.Razorpay) {
        alert("❌ Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: response.key,
        order_id: response.orderId,
        amount: response.amount,
        currency: response.currency,
        name: "WTL",
        description: `${paymentType} GDC Activation`,

        handler: function (res) {
          console.log("✅ Payment success:", res);
          alert("Payment successful!");
        },

        modal: {
          ondismiss: function () {
            console.log("⚠️ Payment popup closed");
          },
        },
      };

      console.log("🚀 Opening Razorpay popup");
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("❌ Payment failed:", response.error);
        alert(response.error.description);
      });

      rzp.open();

    } catch (err) {
      console.error("❌ Error:", err);
      alert(err?.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Payments</h2>

      {step === 0 && (
        <>
          <button onClick={() => selectType("DRIVER")}>
            🚚 Driver Payment
          </button>
          <br /><br />
          <button onClick={() => selectType("TRANSPORTER")}>
            🏢 Transporter Payment
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <button onClick={() => setStep(0)}>← Back</button>
          <br /><br />
          <input
            value={gdcNumber}
            onChange={(e) => setGdcNumber(e.target.value)}
            placeholder="Enter GDC Number"
          />
          <br />
          {error && <p style={{ color: "red" }}>{error}</p>}
          <br />
          <button onClick={proceedToPay}>Proceed to Pay</button>
        </>
      )}

      {step === 2 && (
        <>
          <button onClick={() => setStep(1)}>← Back</button>
          <p><b>Type:</b> {paymentType}</p>
          <p><b>GDC:</b> {gdcNumber}</p>

          <button onClick={openRazorpay} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </>
      )}
    </div>
  );
}
