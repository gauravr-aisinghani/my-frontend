// src/api/transporterVerificationApi.js
import api from "./axiosInstance";

// ✅ relative path only (axiosInstance already has baseURL)
const API_URL = "/api/transporter-verification";

export default {
  getPendingTransporters: async () => {
    const res = await api.get(`${API_URL}/pending`);
    return res.data;
  },

  getTransporterDocuments: async (transporterRegistrationId) => {
    const res = await api.get(
      `${API_URL}/documents/${transporterRegistrationId}`
    );
    return res.data;
  },

  approveTransporter: async ({
    transporterRegistrationId,
    remarks,
    approvedBy,
  }) => {
    const payload = {
      transporter_registration_id: transporterRegistrationId,
      remarks,
      approved_by: approvedBy,
    };

    const res = await api.post(`${API_URL}/approve`, payload);
    return res.data;
  },

  rejectTransporter: async ({ transporterRegistrationId, remarks }) => {
    const payload = {
      transporter_registration_id: transporterRegistrationId,
      remarks,
    };

    const res = await api.post(`${API_URL}/reject`, payload);
    return res.data;
  },
};
