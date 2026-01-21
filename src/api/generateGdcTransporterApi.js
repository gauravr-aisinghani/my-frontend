import api from "./axiosInstance";

// ✅ Backend ke exact endpoint ke according
const API_BASE = "/api/transporter-gdc";

const generateGdcTransporterApi = {
  async generateGdc(payload) {
    try {
      const res = await api.post(`${API_BASE}/generate`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      console.error("Error generating transporter GDC", err);
      throw err;
    }
  },

  async getApprovedTransporters() {
    try {
      const res = await api.get(
        "https://my-backend-1-qxc9.onrender.com/api/transporter-verification/approved",
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      console.error("Error fetching approved transporters", err);
      throw err;
    }
  },
};

export default generateGdcTransporterApi;
