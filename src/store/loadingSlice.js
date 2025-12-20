// src/store/loadingSlice.js
import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: { isLoading: false, count: 0 },
  reducers: {
    startLoading: (state) => {
      state.count += 1;
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.count -= 1;
      if (state.count <= 0) {
        state.isLoading = false;
        state.count = 0;
      }
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
