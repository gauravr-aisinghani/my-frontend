import api from "./axiosInstance";

// ✅ api already has baseURL
const API_BASE = "/api/transporter-final";

const generateGdcTransporterApi = {
  async generateGdc(payload) {
    try {
      const res = await api.post(`${API_BASE}/generate-gdc`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      console.error("Error generating transporter GDC", err);
      throw err;
    }
  },

  // ✅ fetch verified transporters (ABSOLUTE URL — kept as-is)
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
