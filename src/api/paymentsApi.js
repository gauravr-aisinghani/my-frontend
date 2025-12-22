import axios from "axios";

// 🔴 IMPORTANT: USE LOCAL BACKEND FOR NOW
const API_BASE = "http://localhost:8080"; // change port if needed

export const createPaymentOrder = async (payload) => {
  console.log("📡 Sending request to backend:", payload);

  const res = await axios.post(
    `${API_BASE}/api/payments/create-order`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("📡 Backend response:", res.data);
  return res.data;
};
