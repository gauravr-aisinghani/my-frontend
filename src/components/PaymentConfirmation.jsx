import React from "react";

export default function PaymentConfirmation({ paymentInfo, onBack }) {
  const { driverName, gdcNumber, paymentType, amount } = paymentInfo;

  return (
    <div className="payment-confirmation">
      <h2>Confirm Payment Details</h2>

      <p><b>Driver Name:</b> {driverName}</p>
      <p><b>GDC Number:</b> {gdcNumber}</p>
      <p><b>Payment Type:</b> {paymentType}</p>
      <p><b>Amount Payable:</b> ₹{amount}</p>

      <div style={{ marginTop: "16px" }}>
        <button onClick={onBack}>← Back</button>
        <button style={{ marginLeft: "12px" }} disabled>
          Pay Now (Next Step)
        </button>
      </div>
    </div>
  );
}
