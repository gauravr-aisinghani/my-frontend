// src/api/dashboardApi.js
import axios from "axios";

// const BASE = "http://localhost:8089/api/client"; // backend URL
const BASE ="https://my-backend-1-qxc9.onrender.com";;
const dashboardApi = {
  
  async fetchSummary() {
    try {
      // Replace with backend API call when ready
      // const res = await axios.get(`${BASE}/summary`, { withCredentials: true });
      // return res.data;

      // dummy data for now
      return {
        driverVisitors: 25,
        transporterVisitors: 14,
        driverPaid: 6,
        transporterPaid: 5,
        pendingPayments: 8,
        driverFinal: 10,
        totalVehicles: 120,
        availableVehicles: 52,
        assignedVehicles: 68,
        vehiclesByType: { "Tata Ace": 30, "Bolero": 40, "Trailer": 25, "Pickup": 25 },
        reportCounts: { driverReports: 120, transporterReports: 45, paymentReports: 74, visitorReports: 39 }
      };
    } catch (err) {
      console.error(err);
      return {
        driverVisitors: 0,
        transporterVisitors: 0,
        driverPaid: 0,
        transporterPaid: 0,
        pendingPayments: 0,
        driverFinal: 0,
        totalVehicles: 0,
        availableVehicles: 0,
        assignedVehicles: 0,
        vehiclesByType: {},
        reportCounts: { driverReports: 0, transporterReports: 0, paymentReports: 0, visitorReports: 0 }
      };
    }
  },

  exportCsv(data, filename = "export.csv") {
    const rows = [
      Object.keys(data[0] || {}).join(","),
      ...data.map((r) =>
        Object.values(r)
          .map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`)
          .join(",")
      )
    ].join("\n");

    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  },

  // 🔥 NEW: logout API
  async logout() {
    try {
      const res = await axios.post(`${BASE}/logout`, {}, { withCredentials: true });
      return res.data;
      
    } catch (err) {
      console.error("Logout failed", err);
      // Redirect to login page after logout
    navigate("/", { replace: true });
    }
    
  }
};

export default dashboardApi;
