// src/api/transporterVerificationApi.js
import api from "./axiosInstance";


const API_URL = `${api}/api/transporter-verification`;

export default {
  getPendingTransporters: async () => {
    const res = await api.get(`${API_URL}/pending`);
    return res.data;
  },

  getTransporterDocuments: async (transporterRegistrationId) => {
    const res = await api.get(`${API_URL}/documents/${transporterRegistrationId}`);
    return res.data;
  },

  approveTransporter: async ({ transporterRegistrationId, remarks, approvedBy }) => {
    const payload = {
      transporter_registration_id: transporterRegistrationId,
      remarks,
      approved_by: approvedBy,
    };
    return (await api.post(`${API_URL}/approve`, payload)).data;
  },

  rejectTransporter: async ({ transporterRegistrationId, remarks }) => {
    const payload = {
      transporter_registration_id: transporterRegistrationId,
      remarks,
    };
    return (await api.post(`${API_URL}/reject`, payload)).data;
  },
};
