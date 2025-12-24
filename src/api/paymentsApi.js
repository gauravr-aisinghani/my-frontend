import api from "./axiosInstance";

/**
 * CREATE PAYMENT ORDER
 */
export const createPaymentOrder = async ({ gdc_number, type }) => {
  const res = await api.post("/api/payments/create-order", {
    gdc_number,   // ✅ snake_case sent to backend
    type,
  });
  return res.data;
};

/**
 * VERIFY PAYMENT
 */
export const verifyPayment = async ({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}) => {
  const res = await api.post("/api/payments/verify", {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
  });
  return res.data;
};
