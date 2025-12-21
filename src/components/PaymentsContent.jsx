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
    <div className="form-container">
      <h2 className="form-title">Payments</h2>

      {step === 0 && (
        <div className="space-y-4">
          <div
            onClick={() => selectType("DRIVER")}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            🚚 <b>Driver Payment</b>
            <p className="text-sm text-gray-600">
              Pay & activate Driver GDC
            </p>
          </div>

          <div
            onClick={() => selectType("TRANSPORTER")}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
          >
            🏢 <b>Transporter Payment</b>
            <p className="text-sm text-gray-600">
              Pay & activate Transporter GDC
            </p>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-4">
          <button className="btn-secondary" onClick={() => setStep(0)}>
            ← Back
          </button>

          <h4>Enter {paymentType} GDC Number</h4>

          <input
            type="text"
            className={`input ${error ? "input-error" : ""}`}
            value={gdcNumber}
            onChange={(e) => setGdcNumber(e.target.value)}
            placeholder="Enter GDC Number"
          />

          {error && <p className="error-text">{error}</p>}

          <button className="btn-primary" onClick={proceedToPay}>
            Proceed to Pay
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-3">
          <button className="btn-secondary" onClick={() => setStep(1)}>
            ← Back
          </button>

          <h4>Payment Summary</h4>
          <p><b>Type:</b> {paymentType}</p>
          <p><b>GDC Number:</b> {gdcNumber}</p>
          <p><b>Amount:</b> ₹{PAYMENT_AMOUNT}</p>

          <button
            className="btn-primary"
            onClick={openRazorpay}
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      )}
    </div>
  );
}
