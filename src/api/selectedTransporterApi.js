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

export const getAllSelectedTransporters = async () => {
  try {
    const res = await axios.get(BASE_URL, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching selected transporters", err);
    throw err;
  }
};