import api from "./axiosInstance";


const API_BASE = `${api}/api/transporter-final`;

const generateGdcTransporterApi = {
  async generateGdc(payload) {
    try {
      const res = await axios.post(`${API_BASE}/generate-gdc`, payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      console.error("Error generating transporter GDC", err);
      throw err;
    }
  },

  // ✅ fetch verified transporters
  async getApprovedTransporters() {
    try {
      const res = await axios.get(
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
