import axios from "axios";

const superAdminApi = axios.create({
  // baseURL: "http://localhost:8089/api", 
  baseURL:"https://my-backend-1-qxc9.onrender.com/api",
  withCredentials: true, // important for sessions
});

export default superAdminApi;
