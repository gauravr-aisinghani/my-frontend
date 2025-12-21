import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:8089/api/drivers",
  baseURL: "https://my-backend-1-qxc9.onrender.com/api/reports/drivers",
  withCredentials: true,
});




export const fetchDriverReports = () => {
  return axios.get(API_URL);
};






