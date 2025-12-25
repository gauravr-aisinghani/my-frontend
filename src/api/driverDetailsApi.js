// src/api/driverRegistrationApi.js
import api from "./axiosInstance";

/**
 * Start Driver Registration (Step 1)
 * Creates a master driver_registration entry and returns the generated ID.
 * @param {Object} driverData - Step 1 driver details
 * @param {string} driverData.createdByType - Type of registration (e.g., SELF)
 */
export const startDriverRegistration = async (driverData) => {
  try {
    // Pass createdByType as query param, rest of data in payload
    const res = await api.post(
      "/api/driver-registration/start",
      driverData, // backend should accept full payload in POST body
      { params: { type: driverData.createdByType } }
    );

    console.log("Backend FULL Response:", res.data);
    return res.data; // contains driver_registration_id
  } catch (error) {
    console.error("Error starting driver registration:", error);
    throw error;
  }
};

/**
 * Fetch driver registration by ID
 * @param {number|string} id - driver_registration_id
 */
export const getDriverRegistrationById = async (id) => {
  try {
    const res = await api.get(`/api/driver-registration/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching driver registration:", error);
    throw error;
  }
};
