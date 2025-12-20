// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import driverRegistrationReducer from "./driverRegistrationSlice";
import dailyVisitorsReducer from "./dailyVisitorsSlice";
import selectedDriversReducer from "./selectedDriversSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

// ⭐ ADD THIS
import loadingReducer from "./loadingSlice";

// --- Centralized Redux Store ---
const store = configureStore({
  reducer: {
    driverRegistration: driverRegistrationReducer, 
    dailyVisitors: dailyVisitorsReducer,           
    selectedDrivers: selectedDriversReducer,       
    dashboard: dashboardReducer,

    // ⭐ GLOBAL LOADER REDUCER
    loading: loadingReducer,
  },
});

// === Persist Only Driver Registration ===
const STORAGE_KEY = "driver_registration_v1";

store.subscribe(() => {
  try {
    const state = store.getState().driverRegistration;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("LocalStorage save error:", e);
  }
});

export default store;
