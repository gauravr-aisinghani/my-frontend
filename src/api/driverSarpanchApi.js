import axios from "axios";

const api = axios.create({
//   baseURL: "http://localhost:8089/api/drivers/sarpanch",
  baseURL:"https://my-backend-1-qxc9.onrender.com/api/drivers/sarpanch",
  withCredentials: true,
});

const driverSarpanchApi = {
  createForDriver: (driverId, data) => api.post(`/driver/${driverId}`, data),
};

export default driverSarpanchApi;
