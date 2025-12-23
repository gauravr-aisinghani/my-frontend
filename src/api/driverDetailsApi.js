import api from "./axiosInstance";


// const api = axios.create({
//   // baseURL: "http://localhost:8089/api/drivers",
//   baseURL: "https://my-backend-1-qxc9.onrender.com/api/drivers",
//   withCredentials: true,
// });

export const saveDriverDetails = async (driverData) => {
  try {
    const res = await api.post("/api/drivers", driverData);

    console.log("Backend FULL Response:", res.data);

    // Return full backend object (contains driver_registration_id)
    return res.data;
  } catch (error) {
    console.error("Error saving driver details:", error);
    throw error;
  }
};
