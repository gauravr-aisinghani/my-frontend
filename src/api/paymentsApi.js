import api from "./axiosInstance";

/**
 * CREATE PAYMENT ORDER
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

  // only when manual topup
  if (amount !== undefined && amount !== null) {
    payload.amount = amount;
  }

  console.log("CREATE PAYMENT PAYLOAD 👉", payload);

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

  console.log("VERIFY PAYMENT PAYLOAD 👉", payload);

  const res = await api.post("/api/payments/verify", payload);

  return res.data;
};
