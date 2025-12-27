import React, { useState } from "react";
import {
  createPaymentOrder,
  verifyPayment,
} from "../api/paymentsApi";

export default function PaymentsContent() {
  const [step, setStep] = useState(0);
  const [paymentType, setPaymentType] = useState("");
  const [gdcRegistrationNumber, setGdcRegistrationNumber] = useState("");
  const [amount, setAmount] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectType = (type) => {
    setPaymentType(type);
    setGdcRegistrationNumber("");
    setAmount(null);
    setOrderData(null);
    setError("");
    setStep(1);
  };

  // ===============================
  // STEP 1: CREATE ORDER
  // ===============================
  const proceedToPay = async () => {
    if (!gdcRegistrationNumber.trim()) {
      setError("Please enter GDC registration number");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await createPaymentOrder({
        gdc_number: gdcRegistrationNumber.trim(),
        type: paymentType,
      });

      // 🔥 SAFETY CHECK
      if (!res?.orderId) {
        console.error("CREATE ORDER RESPONSE:", res);
        throw new Error("Order ID missing from backend response");
      }

      setOrderData(res);
      setAmount(res.amount / 100);
      setStep(2);

    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Unable to create payment order"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // STEP 2: OPEN RAZORPAY
  // ===============================
  const openRazorpay = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded");
      return;
    }

    if (!orderData?.orderId) {
      alert("Order ID missing. Please try again.");
      console.error("ORDER DATA:", orderData);
      return;
    }

    const options = {
      key: orderData.key,
      order_id: String(orderData.orderId), // ✅ FINAL FIX
      amount: orderData.amount,
      currency: orderData.currency,
      name: "WTL Payments",
      description: `${paymentType} GDC Activation`,

      handler: async function (response) {
        console.log("🔥 RAZORPAY RESPONSE:", response);

        // 🔥 EXTRA SAFETY
        if (
          !response.razorpay_order_id ||
          !response.razorpay_payment_id ||
          !response.razorpay_signature
        ) {
          alert("Invalid payment response from Razorpay");
          console.error("INVALID RAZORPAY RESPONSE:", response);
          return;
        }

        try {
          const res = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          console.log("✅ VERIFY RESPONSE:", res);

          if (res.status !== "SUCCESS") {
            alert("Payment verification failed: " + res.message);
            return;
          }

          alert("Payment successful!");
          setStep(0);

        } catch (err) {
          console.error("❌ VERIFY ERROR:", err);
          alert(
            err?.response?.data?.message ||
            "Payment verification failed. Contact support."
          );
        }
      },

      theme: { color: "#2563eb" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-2xl mt-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-3">
        💳 Payments
      </h2>

      {/* STEP 0 */}
      {step === 0 && (
        <div className="grid gap-6 md:grid-cols-2">
          <div
            onClick={() => selectType("DRIVER")}
            className="p-8 border rounded-2xl cursor-pointer hover:shadow-lg"
          >
            🚚 Driver Payment
          </div>
          <div
            onClick={() => selectType("TRANSPORTER")}
            className="p-8 border rounded-2xl cursor-pointer hover:shadow-lg"
          >
            🏢 Transporter Payment
          </div>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-4">
          <input
            value={gdcRegistrationNumber}
            onChange={(e) => setGdcRegistrationNumber(e.target.value)}
            placeholder="Enter GDC Registration Number"
            className="w-full p-3 border rounded-xl"
          />

          {error && <p className="text-red-600">{error}</p>}

          <button
            onClick={proceedToPay}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl"
          >
            {loading ? "Checking..." : "Proceed"}
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4">
          <p><b>Type:</b> {paymentType}</p>
          <p><b>GDC:</b> {gdcRegistrationNumber}</p>
          <p className="text-lg font-semibold">
            <b>Amount:</b> ₹{amount}
          </p>

          <button
            onClick={openRazorpay}
            className="w-full bg-green-600 text-white py-3 rounded-xl"
          >
            Pay Now
          </button>
        </div>
      )}
    </div>
  );
}
