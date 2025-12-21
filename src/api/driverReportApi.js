import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8089/api/reports/drivers",
  baseURL: "https://my-backend-1-qxc9.onrender.com/api/reports/drivers",
  withCredentials: true,
});

// Fetch all driver reports
export const fetchDriverReports = async () => {
  try {
    const res = await api.get(""); // No extra URL since baseURL already points to endpoint
    console.log("Backend FULL Response:", res.data);

    // Return full backend object (list of driver reports)
    return res.data;
  } catch (error) {
    console.error("Error fetching driver reports:", error);
    throw error;
  }
};
