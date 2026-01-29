import api from "./axiosInstance";

const transporterDriverRequestApi = {
  /**
   * Raise driver requirement request
   */
  raiseRequest: async (payload) => {
    const res = await api.post(
      "/api/driver-request/create",
      payload
    );
    return res.data;
  },

  /**
   * Get all requests (admin / transporter dashboard)
   */
  getAllRequests: async () => {
    const res = await api.get("/api/driver-request/all");
    return res.data;
  },

  /**
   * Get request by ID
   */
  getRequestById: async (id) => {
    const res = await api.get(`/api/driver-request/${id}`);
    return res.data;
  },

  /**
   * Accept request (ADMIN)
   */
  acceptRequest: async (requestId) => {
    const res = await api.post(
      `/api/driver-request/accept/${requestId}`
    );
    return res.data;
  },
};

export default transporterDriverRequestApi;
