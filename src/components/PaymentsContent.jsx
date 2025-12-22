import React, { useState } from "react";
import { createPaymentOrder } from "../api/paymentsApi";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [gdcNumber, setGdcNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const selectType = (type) => {
    setPaymentType(type);
    setStep(1);
  };

  const proceedToPay = () => {
    if (!gdcNumber.trim()) {
      alert("Enter GDC number");
      return;
    }
    setStep(2);
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
        name: "WTL",
        description: `${paymentType} GDC Activation`,

        handler: function (res) {
          console.log("Payment success:", res);
          alert("Payment successful!");
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Payments</h2>

      {step === 0 && (
        <>
          <button onClick={() => selectType("DRIVER")}>🚚 Driver</button>
          <button onClick={() => selectType("TRANSPORTER")}>🏢 Transporter</button>
        </>
      )}

      {step === 1 && (
        <>
          <input
            placeholder="Enter GDC Number"
            value={gdcNumber}
            onChange={(e) => setGdcNumber(e.target.value)}
          />
          <button onClick={proceedToPay}>Proceed</button>
        </>
      )}

      {step === 2 && (
        <>
          <p>Type: {paymentType}</p>
          <p>GDC: {gdcNumber}</p>
          <button onClick={openRazorpay} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </>
      )}
    </div>
  );
}
