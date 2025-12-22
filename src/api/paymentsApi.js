import axios from "axios";

const API_BASE = "https://my-backend-1-qxc9.onrender.com";

// 🔹 STEP 1: VALIDATE GDC
export const validateGdc = async (payload) => {
  const res = await axios.post(
    `${API_BASE}/api/payments/validate`,
    payload
  );
  return res.data;
};

// 🔹 STEP 2: CREATE ORDER
export const createPaymentOrder = async (payload) => {
  const res = await axios.post(
    `${API_BASE}/api/payments/create-order`,
    payload
  );
  return res.data;
};
