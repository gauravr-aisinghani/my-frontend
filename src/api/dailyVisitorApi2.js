// src/api/dailyVisitorApi2.js
import axios from "axios";

const API_BASE = "https://my-backend-1-qxc9.onrender.com/api/visitor-driver";
const SELECTED_API = "https://my-backend-1-qxc9.onrender.com/api/selected-driver";

const dailyVisitorsApi2 = {
  // Save new visitor
  async saveVisitor(visitor) {
    try {
      const res = await axios.post(API_BASE, visitor, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("Error saving visitor", err);
      throw err;
    }
  },

  // Get all visitors
  async getVisitors() {
    try {
      const res = await axios.get(API_BASE, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("Error fetching visitors", err);
      throw err;
    }
  },

  // Add visitor to selected_driver table
  async addToSelected(visitor) {
    try {
      const res = await axios.post(SELECTED_API, visitor, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("Error adding to selected drivers", err);
      throw err;
    }
  },

  // Get all selected drivers
  async getSelectedDrivers() {
    try {
      const res = await axios.get(SELECTED_API, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("Error fetching selected drivers", err);
      throw err;
    }
  },

  // DELETE visitor
  async deleteVisitor(id) {
    try {
      const res = await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
      return res.data;
    } catch (err) {
      console.error("Error deleting visitor driver", err);
      throw err;
    }
  },
};

export default dailyVisitorsApi2;
