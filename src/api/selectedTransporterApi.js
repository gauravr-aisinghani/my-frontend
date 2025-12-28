import api from "./axiosInstance";

// ✅ api already has baseURL → use relative path ONLY
const BASE_URL = "/api/selected-transporter";

// save selected transporter
export const saveSelectedTransporter = async (data) => {
  try {
    const res = await api.post(`${BASE_URL}/save`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error saving selected transporter", err);
    throw err;
  }
};

// get all selected transporters
export const getAllSelectedTransporters = async () => {
  try {
    const res = await api.get(BASE_URL, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching selected transporters", err);
    throw err;
  }
};
