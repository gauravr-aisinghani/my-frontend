// src/store/selectedDriversSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedDrivers: [],
};

const selectedDriversSlice = createSlice({
  name: "selectedDrivers",
  initialState,
  reducers: {
    addSelectedDriver(state, action) {
      state.selectedDrivers.push(action.payload);
    },
    setSelectedDrivers(state, action) {
      state.selectedDrivers = action.payload;
    },
  },
});

export const { addSelectedDriver, setSelectedDrivers } = selectedDriversSlice.actions;
export default selectedDriversSlice.reducer;
