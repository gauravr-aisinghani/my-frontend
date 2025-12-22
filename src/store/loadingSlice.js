import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    pendingRequests: 0,
  },
  reducers: {
    startLoading: (state) => {
      state.pendingRequests += 1;
    },
    stopLoading: (state) => {
      state.pendingRequests = Math.max(0, state.pendingRequests - 1);
    },
    resetLoading: (state) => {
      state.pendingRequests = 0;
    },
  },
});

export const { startLoading, stopLoading, resetLoading } =
  loadingSlice.actions;

export default loadingSlice.reducer;
