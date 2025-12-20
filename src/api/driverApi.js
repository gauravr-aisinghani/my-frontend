import api from "./axiosConfig";

// Send driver data to backend
export const sendDriverDetails = async (driverData) => {
  const res = await api.post("/api/driver/details", driverData);
  return res.data;
};
