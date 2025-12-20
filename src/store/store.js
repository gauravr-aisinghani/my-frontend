// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";

import driverRegistrationReducer from "./driverRegistrationSlice";
import transporterRegistrationReducer from "./transporterRegistrationSlice"; // ✅ NEW

import dailyVisitorsReducer from "./dailyVisitorsSlice";
import selectedDriversReducer from "./selectedDriversSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import loadingReducer from "./loadingSlice";

// --- Centralized Redux Store ---
const store = configureStore({
  reducer: {
    // ✅ EXISTING (UNCHANGED)
    driverRegistration: driverRegistrationReducer,

    // ✅ NEW (TRANSPORTER FLOW)
    transporterRegistration: transporterRegistrationReducer,

    dailyVisitors: dailyVisitorsReducer,
    selectedDrivers: selectedDriversReducer,
    dashboard: dashboardReducer,
    loading: loadingReducer,
  },
});


// ===============================
// 🔐 Persist DRIVER registration
// ===============================
const DRIVER_STORAGE_KEY = "driver_registration_v1";

store.subscribe(() => {
  try {
    const state = store.getState().driverRegistration;
    localStorage.setItem(DRIVER_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Driver LocalStorage save error:", e);
  }
});


// ===================================
// 🔐 Persist TRANSPORTER registration
// ===================================
const TRANSPORTER_STORAGE_KEY = "transporter_registration_v1";

store.subscribe(() => {
  try {
    const state = store.getState().transporterRegistration;
    localStorage.setItem(TRANSPORTER_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Transporter LocalStorage save error:", e);
  }
});

export default store;
