import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "driver_registration_v1";

const loadInitialState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        step: 1,
        registrationId: null,
        driverId: null,
        step1: {},
        step2: {},
        step3: { files: {} },
        step4: { verification: {} },
        submitted: false,
        savedRecord: null,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      step: 1,
      registrationId: null,
      driverId: null,
      step1: {},
      step2: {},
      step3: { files: {} },
      step4: { verification: {} },
      submitted: false,
      savedRecord: null,
    };
  }
};

const initialState = loadInitialState();

const slice = createSlice({
  name: "driverRegistration",
  initialState,
  reducers: {
    setStep(state, action) {
      state.step = action.payload;
    },

    updateStep1(state, action) {
      state.step1 = { ...state.step1, ...action.payload };
    },

    updateStep2(state, action) {
      state.step2 = { ...state.step2, ...action.payload };
    },

    updateStep3Files(state, action) {
      state.step3 = {
        ...state.step3,
        files: { ...state.step3.files, ...action.payload },
      };
    },

    updateVerification(state, action) {
      state.step4.verification = {
        ...state.step4.verification,
        ...action.payload,
      };
    },

    setRegistrationId(state, action) {
      state.registrationId = action.payload;
    },

    setDriverId(state, action) {
      state.driverId = action.payload;
    },

    setSubmitted(state, action) {
      state.submitted = action.payload.submitted;
      if (action.payload.savedRecord) {
        state.savedRecord = action.payload.savedRecord;
      }
    },

    // ⭐ CLEAR ONLY FORM FIELDS — Keep registrationId, driverId, step safe
    clearCurrentForm(state) {
      state.step1 = {};
      state.step2 = {};
      state.step3 = { files: {} };
      state.step4 = { verification: {} };
    },

    // Full reset (when everything is finished)
    resetAll(state) {
      state.step = 1;
      state.registrationId = null;
      state.driverId = null;
      state.step1 = {};
      state.step2 = {};
      state.step3 = { files: {} };
      state.step4 = { verification: {} };
      state.submitted = false;
      state.savedRecord = null;
    },
  },
});

export const {
  setStep,
  updateStep1,
  updateStep2,
  updateStep3Files,
  updateVerification,
  setDriverId,
  setRegistrationId,
  setSubmitted,
  clearCurrentForm,  // ⭐ export new action
  resetAll,
} = slice.actions;

export default slice.reducer;

export const selectDriverRegistration = (state) => state.driverRegistration;
