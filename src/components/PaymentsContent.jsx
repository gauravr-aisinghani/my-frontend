import React, { useState } from "react";
import { createPaymentOrder } from "../api/paymentsApi";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [gdcNumber, setGdcNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const selectType = (type) => {
    console.log("👉 Selected type:", type);
    setPaymentType(type);
    setStep(1);
  };

  const proceedToPay = () => {
    console.log("👉 Proceed clicked, GDC:", gdcNumber);
    if (!gdcNumber.trim()) {
      alert("Enter GDC number");
      return;
    }
    setStep(2);
  };

  const testBackendCall = async () => {
    console.log("🔥 Pay Now clicked");

    try {
      setLoading(true);

      const res = await createPaymentOrder({
        gdcNumber,
        type: paymentType,
      });

      console.log("✅ Backend responded:", res);
      alert("Request reached backend (check Network tab)");

    } catch (err) {
      console.error("❌ Error:", err);
      alert("Error occurred — check Network tab & console");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Payments (DEBUG MODE)</h2>

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
          <br />
          <button onClick={() => setStep(0)}>← Back</button>
          <br /><br />
          <input
            placeholder="Enter GDC Number"
            value={gdcNumber}
            onChange={(e) => setGdcNumber(e.target.value)}
          />
          <br /><br />
          <button onClick={proceedToPay}>Proceed</button>
        </>
      )}

      {step === 2 && (
        <>
          <br />
          <p><b>Type:</b> {paymentType}</p>
          <p><b>GDC:</b> {gdcNumber}</p>

          <button onClick={testBackendCall} disabled={loading}>
            {loading ? "Testing..." : "Pay Now (TEST)"}
          </button>
        </>
      )}
    </div>
  );
}
