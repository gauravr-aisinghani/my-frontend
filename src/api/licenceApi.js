import api from "./axiosInstance";

// const api = axios.create({
//   // baseURL: "http://localhost:8089/api/drivers/licences",
//   baseURL:"https://my-backend-1-qxc9.onrender.com/api/drivers/licences",
//   withCredentials: true,
// });

export const saveLicenceDetails = async (driverId, licenceData) => {
  return api.post(`/api/drivers/licences/driver/${driverId}`, licenceData);
};
