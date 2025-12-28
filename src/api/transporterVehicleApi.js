import api from "./axiosInstance";

// ✅ relative path for this module
const BASE_URL = "/api/transporter-vehicle";

export const saveTransporterVehicle = async (data) => {
  try {
    const res = await api.post(BASE_URL, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("Error saving transporter vehicle:", error);
    throw error;
  }
};
