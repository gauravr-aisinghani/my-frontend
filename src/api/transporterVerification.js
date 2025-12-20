// src/api/transporterVerificationApi.js
import axios from "axios";

const API_URL = "https://my-backend-1-qxc9.onrender.com/api/transporter-verification";

export default {
  getPendingTransporters: async () => {
    const res = await axios.get(`${API_URL}/pending`);
    return res.data;
  },

  getTransporterDocuments: async (transporterRegistrationId) => {
    const res = await axios.get(`${API_URL}/documents/${transporterRegistrationId}`);
    return res.data;
  },

  approveTransporter: async ({ transporterRegistrationId, remarks, approvedBy }) => {
    const payload = {
      transporter_registration_id: transporterRegistrationId,
      remarks,
      approved_by: approvedBy,
    };
    return (await axios.post(`${API_URL}/approve`, payload)).data;
  },

  rejectTransporter: async ({ transporterRegistrationId, remarks }) => {
    const payload = {
      transporter_registration_id: transporterRegistrationId,
      remarks,
    };
    return (await axios.post(`${API_URL}/reject`, payload)).data;
  },
};
