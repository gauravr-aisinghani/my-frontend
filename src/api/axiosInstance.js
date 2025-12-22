import axios from "axios";
import store from "../store/store";
import { showLoader, hideLoader } from "../store/loadingSlice";

const axiosInstance = axios.create({
  baseURL: "https://my-backend-1-qxc9.onrender.com", // your backend
});

// 🔥 REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    store.dispatch(showLoader());
    return config;
  },
  (error) => {
    store.dispatch(hideLoader());
    return Promise.reject(error);
  }
);

// 🔥 RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    store.dispatch(hideLoader());
    return response;
  },
  (error) => {
    store.dispatch(hideLoader());
    return Promise.reject(error);
  }
);

export default axiosInstance;
