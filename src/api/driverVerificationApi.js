// src/api/driverVerificationApi.js
import axios from "axios";

const API_URL = "https://my-backend-1-qxc9.onrender.com/api/driver-verification";

export default {
  getPendingDrivers: async () => {
    const res = await axios.get(`${API_URL}/pending`);
    return res.data;
  },

  getDriverDocuments: async (driverRegistrationId) => {
    const res = await axios.get(`${API_URL}/documents/${driverRegistrationId}`);
    return res.data;
  },

  approveDriver: async ({ driverRegistrationId, remarks, approvedBy }) => {
    const payload = {
      driver_registration_id: driverRegistrationId,
      remarks,
      approved_by: approvedBy,
    };
    return (await axios.post(`${API_URL}/approve`, payload)).data;
  },

  rejectDriver: async ({ driverRegistrationId, remarks }) => {
    const payload = {
      driver_registration_id: driverRegistrationId,
      remarks,
    };
    return (await axios.post(`${API_URL}/reject`, payload)).data;
  },
};
