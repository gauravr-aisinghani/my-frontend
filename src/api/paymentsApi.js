import api from "./axiosInstance";

/**
 * CREATE PAYMENT ORDER
 * Backend will:
 * - Validate GDC
 * - Decide amount
 * - Create Razorpay order
 */
export const createPaymentOrder = async ({ gdcNumber, type }) => {
  const res = await api.post("/api/payments/create-order", {
    gdcNumber,
    type,
  });
  return res.data;
};

/**
 * VERIFY PAYMENT (after Razorpay success)
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
