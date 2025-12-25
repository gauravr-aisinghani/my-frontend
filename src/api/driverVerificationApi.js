// src/api/driverVerificationApi.js
import api from "./axiosInstance";

export default {
  getPendingDrivers: async () => {
    const res = await api.get("/api/driver-verification/pending");
    return res.data;
  },

  getDriverDocuments: async (driverRegistrationId) => {
    const res = await api.get(
      `/api/driver-verification/documents/${driverRegistrationId}`
    );
    return res.data;
  },

  approveDriver: async ({ driverRegistrationId, remarks, approvedBy }) => {
    const payload = {
      driver_registration_id: driverRegistrationId,
      remarks,
      approved_by: approvedBy,
    };

    const res = await api.post(
      "/api/driver-verification/approve",
      payload
    );
    return res.data;
  },

  rejectDriver: async ({ driverRegistrationId, remarks }) => {
    const payload = {
      driver_registration_id: driverRegistrationId,
      remarks,
    };

    const res = await api.post(
      "/api/driver-verification/reject",
      payload
    );
    return res.data;
  },
};
