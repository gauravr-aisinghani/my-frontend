import axios from "axios";
import store from "../store/store";                 // ⭐ added
import { showLoader,hideLoader } from "../store/loadingSlice";   // ⭐ added

axios.defaults.withCredentials = true; // REQUIRED for production cookies

const api = axios.create({
  baseURL: "https://my-backend-1-qxc9.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ===============================
// ⭐ GLOBAL LOADER INTERCEPTORS
// ===============================
api.interceptors.request.use(
  (config) => {
    store.dispatch(showLoader());  // 🔥 Start loader
    return config;
  },
  (error) => {
    store.dispatch(hideLoader());   // 🔥 Stop loader on error
    return Promise.reject(error);
  }
);

// ===============================
// ⭐ YOUR EXISTING 401 LOGIC
// ===============================
let isInitialStatusCheck = true;

api.interceptors.response.use(
  (response) => {
    store.dispatch(showLoader());    // 🔥 Stop loader
    isInitialStatusCheck = false;
    return response;
  },
  (error) => {
    store.dispatch(hideLoader());    // 🔥 Stop loader even on failure

    if (error.response && error.response.status === 401) {
      if (isInitialStatusCheck) {
        return Promise.reject(error);
      }
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
