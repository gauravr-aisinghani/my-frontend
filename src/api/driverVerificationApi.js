// src/api/driverVerificationApi.js
import api from "./axiosInstance";


// const API_URL = `${api}api/driver-verification`;

export default {
  getPendingDrivers: async () => {
    const res = await api.get(`${api}/api/driver-verification/pending`);
    return res.data;
  },

  getDriverDocuments: async (driverRegistrationId) => {
    const res = await api.get(`${api}/api/driver-verification/documents/${driverRegistrationId}`);
    return res.data;
  },

  approveDriver: async ({ driverRegistrationId, remarks, approvedBy }) => {
    const payload = {
      driver_registration_id: driverRegistrationId,
      remarks,
      approved_by: approvedBy,
    };
    return (await api.post(`${api}/api/driver-verification/approve`, payload)).data;
  },

  rejectDriver: async ({ driverRegistrationId, remarks }) => {
    const payload = {
      driver_registration_id: driverRegistrationId,
      remarks,
    };
    return (await api.post(`${api}/api/driver-verification/reject`, payload)).data;
  },
};
