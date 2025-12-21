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

  // ✅ Correct Razorpay flow
  const openRazorpay = async () => {
    try {
      setLoading(true);

      // 1️⃣ Call backend to create order
      const orderResponse = await createPaymentOrder({
        amount: PAYMENT_AMOUNT,
        paymentType,
        gdcNumber,
      });

      const options = {
        key: orderResponse.keyId, // from backend
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        order_id: orderResponse.orderId,

        name: "WTL Payments",
        description: `${paymentType} GDC Activation`,

        handler: function (response) {
          console.log("Payment Success:", response);

          /*
            response = {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature
            }
          */

          alert("Payment successful!");
          // 👉 next step: call backend /verify-payment
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
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      <h2>Payments</h2>

      {step === 0 && (
        <>
          <div onClick={() => selectType("DRIVER")} style={{ cursor: "pointer", marginBottom: "16px" }}>
            🚚 <b>Driver Payment</b>
            <div>Pay & activate Driver GDC</div>
          </div>

          <div onClick={() => selectType("TRANSPORTER")} style={{ cursor: "pointer" }}>
            🏢 <b>Transporter Payment</b>
            <div>Pay & activate Transporter GDC</div>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <button onClick={() => setStep(0)}>← Back</button>

          <h4 style={{ marginTop: "16px" }}>
            Enter {paymentType} GDC Number
          </h4>

          <input
            type="text"
            value={gdcNumber}
            onChange={(e) => setGdcNumber(e.target.value)}
            placeholder="Enter GDC Number"
            style={{ width: "100%", padding: "10px", marginTop: "8px" }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button onClick={proceedToPay} style={{ marginTop: "12px" }}>
            Proceed to Pay
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <button onClick={() => setStep(1)}>← Back</button>

          <h4>Payment Summary</h4>
          <p><b>Type:</b> {paymentType}</p>
          <p><b>GDC Number:</b> {gdcNumber}</p>
          <p><b>Amount:</b> ₹{PAYMENT_AMOUNT}</p>

          <button onClick={openRazorpay} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </>
      )}
    </div>
  );
}
