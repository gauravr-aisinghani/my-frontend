import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8089/api/reports/drivers",
  baseURL: "https://my-backend-1-qxc9.onrender.com/api/reports/drivers",
  withCredentials: true,
});

// Fetch driver reports with stage filter
export const fetchDriverReports = async (filters = {}) => {
  try {
    const res = await api.get("", {
      params: {
        stage: filters.stage || null, // 🔑 THIS IS THE FIX
      },
    });

    console.log("Backend FULL Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching driver reports:", error);
    throw error;
  }
};
