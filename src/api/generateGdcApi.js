// src/api/generateGdcApi.js
import api from "./axiosInstance";

const generateGdcApi = {
  // Generate GDC
  async generateGdc(payload) {
    try {
      const res = await api.post(
        "/api/gdc/generate",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error generating GDC", err);
      throw err;
    }
  },

  // Fetch verified (approved) drivers
  async getApprovedDrivers() {
    try {
      const res = await api.get(
        "/api/driver-verification/approved-drivers"
      );
      return res.data;
    } catch (err) {
      console.error("Error fetching approved drivers", err);
      throw err;
    }
  },
};

export default generateGdcApi;
