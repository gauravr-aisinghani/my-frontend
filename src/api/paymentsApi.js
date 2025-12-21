import axios from "axios";

const API_BASE = "https://my-backend-1-qxc9.onrender.com";

export const createPaymentOrder = async (payload) => {
  const res = await axios.post(
    `${API_BASE}/api/payments/create-order`,
    payload
  );
  return res.data;
};
