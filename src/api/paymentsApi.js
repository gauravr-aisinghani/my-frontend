import api from "./axiosInstance";

/**
 * CREATE PAYMENT ORDER (normal / manual)
 */
export const createPaymentOrder = async ({
  gdc_number,
  type,
  purpose,
  amount,
}) => {
  const payload = {
    gdc_number,
    type,
    purpose,
  };

  if (amount !== undefined && amount !== null) {
    payload.amount = amount;
  }

  const res = await api.post("/api/payments/create-order", payload);
  return res.data;
};

/**
 * CREATE ADVANCE PAYMENT ORDER (🔥 NEW)
 */
export const createAdvancePaymentOrder = async ({
  gdc_number,
  type,
  purpose,
  request_id,
}) => {
  const payload = {
    gdc_number,
    type,
    purpose,
    request_id, // 🔥 reference_id se aaya hua
  };

  const res = await api.post("/api/payments/create-order", payload);
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
  const payload = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  };

  const res = await api.post("/api/payments/verify", payload);
  return res.data;
};
