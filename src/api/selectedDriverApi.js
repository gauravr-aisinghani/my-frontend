// src/api/selectedDriverApi.js
import api from "./axiosInstance";


const API_BASE = `${api}/api/selected-driver`;

const selectedDriverApi = {
  // Add selected driver record
  async addDriver(driverData) {
    try {
      const res = await axios.post(`${API_BASE}/add`, driverData);
      return res.data;
    } catch (err) {
      console.error("Error adding selected driver", err);
      throw err;
    }
  },

  // Get all selected drivers
  async getAllSelectedDrivers() {
    try {
      const res = await axios.get(`${API_BASE}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching selected drivers", err);
      throw err;
    }
  },
};

export default selectedDriverApi;
