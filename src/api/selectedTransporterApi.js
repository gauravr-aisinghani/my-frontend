import axios from "axios";

const BASE_URL =
  "https://my-backend-1-qxc9.onrender.com/api/selected-transporter";

export const saveSelectedTransporter = async (data) => {
  const res = await axios.post(`${BASE_URL}/save`, data, {
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
  });
  return res.data;
};
