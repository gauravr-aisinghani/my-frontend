import axios from "axios";
import store from "../store/store";
import { startLoading, stopLoading } from "../store/loadingSlice";

const axiosInstance = axios.create({
  baseURL: "https://my-backend-1-qxc9.onrender.com", // your backend
});

// 🔥 REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    store.dispatch(startLoading());
    return config;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

// 🔥 RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch(stopLoading());
    return response;
  },
  (error) => {
    store.dispatch(stopLoading());
    return Promise.reject(error);
  }
);

export default axiosInstance;
