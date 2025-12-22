import axios from "axios";

const API_BASE = "https://my-backend-1-qxc9.onrender.com";

/**
 * TEMP DEBUG VERSION
 * This intentionally hits an ALREADY-PERMITTED path
 * to prove whether requests reach backend.
 */
export const createPaymentOrder = async (payload) => {
  console.log("🧪 FRONTEND sending payload:", payload);

  const res = await axios.post(
    `${API_BASE}/api/driver/payment/test`, // 👈 permitted path
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("🧪 FRONTEND received response:", res.status);
  return res.data;
};
