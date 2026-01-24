import api from "./axiosInstance";

const transporterDriverRequestApi = {
  /**
   * Raise driver requirement request
   */
  raiseRequest: async (payload) => {
    try {
      const res = await api.post(
        "/api/transporter/driver-requests",
        payload
      );
      return res.data;
    } catch (err) {
      console.error("Error raising driver request:", err);
      throw err;
    }
  },
};

export default transporterDriverRequestApi;
