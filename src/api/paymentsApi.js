import api from "./axiosInstance";

/**
 * STEP 1: Validate GDC number
 * Sends:
 * {
 *   gdcNumber: string,
 *   type: "DRIVER" | "TRANSPORTER"
 * }
 */
export const validateGdc = async ({ gdcNumber, type }) => {
  const res = await api.post("/api/payments/validate", {
    gdcNumber,
    type,
  });
  return res.data;
};

/**
 * STEP 2: Create Razorpay order
 * Sends:
 * {
 *   gdcNumber: string,
 *   type: "DRIVER" | "TRANSPORTER"
 * }
 */
export const createPaymentOrder = async ({ gdcNumber, type }) => {
  const res = await api.post("/api/payments/create-order", {
    gdcNumber,
    type,
  });
  return res.data;
};
