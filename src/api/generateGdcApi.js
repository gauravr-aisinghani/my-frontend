// src/api/generateGdcApi.js
import api from "./axiosInstance";


const API_BASE = `${api}/api/gdc`;

const generateGdcApi = {
  async generateGdc(payload) {
    try {
      const res = await axios.post(`${API_BASE}/generate`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      console.error("Error generating GDC", err);
      throw err;
    }
  },

  // fetch verified (approved) drivers
  async getApprovedDrivers() {
    try {
      const res = await axios.get(
        "https://my-backend-1-qxc9.onrender.com/api/driver-verification/approved-drivers",
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("Error fetching approved drivers", err);
      throw err;
    }
  },
};

export default generateGdcApi;
