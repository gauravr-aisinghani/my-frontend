import React, { useState } from "react";
import { getDriverPaymentStatus } from "../api/paymentsApi";
import PaymentConfirmation from "./PaymentConfirmation";

export default function PaymentsContent() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [gdc, setGdc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentInfo, setPaymentInfo] = useState(null);

  const selectType = (selectedType) => {
    setType(selectedType);
    setStep(2);
  };

  // 🔹 ONLY fetch details, NO payment creation
  const proceedPayment = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await getDriverPaymentStatus(gdc);

      if (response && response.status === "PAID") {
        setError("Payment already completed for this GDC");
        return;
      }

      // Save fetched details and move to confirmation screen
      setPaymentInfo({
        gdcNumber: gdc,
        paymentType: type.toUpperCase(),
        driverName: response.driverName,
        amount: response.amount,
      });

      setStep(3);
    } catch (err) {
      setError("Invalid GDC number or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      {step === 1 && (
        <div className="payment-tiles-wrapper">
          <div className="payment-tile" onClick={() => selectType("driver")}>
            <div className="tile-icon">🚚</div>
            <h2>Driver Payment</h2>
            <p>Pay & activate Driver GDC</p>
          </div>

          <div
            className="payment-tile"
            onClick={() => selectType("transporter")}
          >
            <div className="tile-icon">🏢</div>
            <h2>Transporter Payment</h2>
            <p>Pay & activate Transporter GDC</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="payment-form">
          <button className="back-btn" onClick={() => setStep(1)}>
            ← Back
          </button>

          <h3>Enter {type} GDC Number</h3>

          <input
            type="text"
            placeholder="Enter GDC Number"
            value={gdc}
            onChange={(e) => setGdc(e.target.value)}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button disabled={!gdc || loading} onClick={proceedPayment}>
            {loading ? "Checking..." : "Proceed to Pay"}
          </button>
        </div>
      )}

      {step === 3 && paymentInfo && (
        <PaymentConfirmation
          paymentInfo={paymentInfo}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}