import api from "./axiosInstance";

/**
 * CREATE PAYMENT ORDER
 */
export const createPaymentOrder = async ({ gdc_number, type }) => {
  const res = await api.post("/api/payments/create-order", {
    gdc_number,
    type,
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
