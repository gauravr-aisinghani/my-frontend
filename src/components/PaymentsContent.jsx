import React, { useState } from "react";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [paymentType, setPaymentType] = useState(""); // DRIVER | TRANSPORTER
  const [gdcNumber, setGdcNumber] = useState("");
  const [error, setError] = useState("");

  const PAYMENT_AMOUNT = 500; // example amount

  // Step 1: Select payment type
  const selectType = (type) => {
    setPaymentType(type);
    setStep(1);
    setError("");
  };

  // Step 2: Proceed after entering GDC
  const proceedToPay = () => {
    if (!gdcNumber.trim()) {
      setError("Please enter GDC number");
      return;
    }

    // 🔹 Backend check will be added later
    setStep(2);
  };

  // Step 3: Razorpay handler (frontend only for now)
  const openRazorpay = () => {
    const options = {
      key: "RAZORPAY_KEY_ID", // backend later
      amount: PAYMENT_AMOUNT * 100,
      currency: "INR",
      name: "WTL Payments",
      description: `${paymentType} GDC Activation`,
      handler: function (response) {
        console.log("Payment Success:", response);
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
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px" }}>
      <h2>Payments</h2>

      {/* STEP 0: Select Type */}
      {step === 0 && (
        <>
          <div
            style={{ cursor: "pointer", marginBottom: "16px" }}
            onClick={() => selectType("DRIVER")}
          >
            🚚 <b>Driver Payment</b>
            <div>Pay & activate Driver GDC</div>
          </div>

          <div
            style={{ cursor: "pointer" }}
            onClick={() => selectType("TRANSPORTER")}
          >
            🏢 <b>Transporter Payment</b>
            <div>Pay & activate Transporter GDC</div>
          </div>
        </>
      )}

      {/* STEP 1: Enter GDC */}
      {step === 1 && (
        <>
          <button onClick={() => setStep(0)}>← Back</button>

          <h4 style={{ marginTop: "16px" }}>
            Enter {paymentType === "DRIVER" ? "Driver" : "Transporter"} GDC Number
          </h4>

          <input
            type="text"
            placeholder="Enter GDC Number"
            value={gdcNumber}
            onChange={(e) => setGdcNumber(e.target.value)}
            style={{ width: "100%", padding: "10px", marginTop: "8px" }}
          />

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            onClick={proceedToPay}
            style={{ marginTop: "12px" }}
          >
            Proceed to Pay
          </button>
        </>
      )}

      {/* STEP 2: Payment Summary */}
      {step === 2 && (
        <>
          <button onClick={() => setStep(1)}>← Back</button>

          <h4>Payment Summary</h4>
          <p><b>Type:</b> {paymentType}</p>
          <p><b>GDC Number:</b> {gdcNumber}</p>
          <p><b>Amount:</b> ₹{PAYMENT_AMOUNT}</p>

          <button
            onClick={openRazorpay}
            style={{ marginTop: "12px" }}
          >
            Pay Now
          </button>
        </>
      )}
    </div>
  );
}
