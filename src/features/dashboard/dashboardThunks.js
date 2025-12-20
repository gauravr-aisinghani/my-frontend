// src/store/dashboardThunks.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import dashboardApi from "../../api/dashboardApi";

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const data = await dashboardApi.fetchSummary();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
