import axios from "axios";

const API_BASE = "https://my-backend-1-qxc9.onrender.com";

export const getDriverPaymentStatus = async (gdcNumber) => {
  const res = await axios.get(
    `${API_BASE}/api/driver/payment/status/${gdcNumber}`
  );
  return res.data;
};

export const createDriverPayment = async (payload) => {
  const res = await axios.post(
    `${API_BASE}/api/driver/payment/create`,
    payload
  );
  return res.data;
};
