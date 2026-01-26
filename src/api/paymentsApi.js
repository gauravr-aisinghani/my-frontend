import api from "./axiosInstance";

/**
 * CREATE PAYMENT ORDER
 * purpose: enum string (TRANSPORTER_ADVANCE | MANUAL_TOPUP | MONTHLY_SETTLEMENT)
 */
export const createPaymentOrder = async ({
  gdc_number,
  type,
  purpose,
  amount,
}) => {
  const res = await api.post("/api/payments/create-order", {
    gdc_number,
    type,
    purpose, // 🔥 IMPORTANT (enum value)
    amount,  // optional (monthly settlement me backend calculate karega)
  });

  return res.data;
};

/**
 * VERIFY PAYMENT
 */
export const verifyPayment = async ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const res = await api.post("/api/payments/verify", {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  return res.data;
};
