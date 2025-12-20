// src/api/adminApi.js
import axios from "axios";

// const BASE_URL = "http://localhost:5000/api/admin";
const BASE_URL = "https://my-backend-1-qxc9.onrender.com"; // replace later with actual backend URL

const adminApi = {
  // ✅ Dummy fetch (replace with backend later)
  async fetchDashboardSummary() {
    try {
      // Uncomment when backend ready:
      // const res = await axios.get(`${BASE_URL}/summary`);
      // return res.data;

      // Dummy data for now
      return Promise.resolve({
        driverVisitors: 25,
        driverFinal: 10,
        driverPaid: 6,
        transporterVisitors: 14,
        transporterFinal: 8,
        transporterPaid: 5,
      });
    } catch (err) {
      console.error("Error fetching dashboard summary:", err);
      return {
        driverVisitors: 0,
        driverFinal: 0,
        driverPaid: 0,
        transporterVisitors: 0,
        transporterFinal: 0,
        transporterPaid: 0,
      };
    }
  },
};

export default adminApi;
