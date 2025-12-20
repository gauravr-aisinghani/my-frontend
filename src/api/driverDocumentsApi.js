// src/api/driverDocumentsApi.js
import axios from "axios";

// const API_BASE = "http://localhost:8089/api/driver-documents";
const API_BASE = "https://my-backend-1-qxc9.onrender.com/api/driver-documents";

const driverDocumentsApi = {
  /**
   * Upload complete driver documents
   * FIX: Do NOT send driverId in URL, backend takes it from form-data
   */
  saveDocuments: async (formData) => {
    try {
      const res = await axios.post(
        `${API_BASE}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("Error uploading driver documents:", err);
      throw err;
    }
  },

  /**
   * Get all documents for one driver
   */
  getByDriverId: async (driverId) => {
    try {
      const res = await axios.get(`${API_BASE}/driver/${driverId}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching driver documents:", err);
      throw err;
    }
  },

  /**
   * Delete a specific document entry (optional use)
   */
  deleteDocument: async (documentId) => {
    try {
      const res = await axios.delete(`${API_BASE}/delete/${documentId}`);
      return res.data;
    } catch (err) {
      console.error("Error deleting document:", err);
      throw err;
    }
  },
};

export default driverDocumentsApi;
