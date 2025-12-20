// src/store/transporterRegistrationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "transporter_registration_v1";

const loadInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        step: 1,
        registrationId: null,
        transporterId: null,
        step1: {},
        step2: {},
        step3: {},
        submitted: false,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      step: 1,
      registrationId: null,
      transporterId: null,
      step1: {},
      step2: {},
      step3: {},
      submitted: false,
    };
  }
};

const initialState = loadInitialState();

const transporterSlice = createSlice({
  name: "transporterRegistration",
  initialState,
  reducers: {
    setTransporterStep(state, action) {
      state.step = action.payload;
    },

    setTransporterRegistrationId(state, action) {
      state.registrationId = action.payload;
    },

    setTransporterId(state, action) {
      state.transporterId = action.payload;
    },

    updateTransporterStep1(state, action) {
      state.step1 = { ...state.step1, ...action.payload };
    },

    updateTransporterStep2(state, action) {
      state.step2 = { ...state.step2, ...action.payload };
    },

    setTransporterSubmitted(state, action) {
      state.submitted = action.payload;
    },

    resetTransporter(state) {
      return initialState;
    },
  },
});

export const {
  setTransporterStep,
  setTransporterRegistrationId,
  setTransporterId,
  updateTransporterStep1,
  updateTransporterStep2,
  setTransporterSubmitted,
  resetTransporter,
} = transporterSlice.actions;

export default transporterSlice.reducer;
