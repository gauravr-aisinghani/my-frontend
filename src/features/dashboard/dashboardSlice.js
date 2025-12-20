// src/features/dashboard/dashboardSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardStats } from "./dashboardThunks";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    driverVisitors: 0,
    transporterVisitors: 0,
    driverPaid: 0,
    transporterPaid: 0,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default dashboardSlice.reducer;
