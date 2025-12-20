import { createSlice } from "@reduxjs/toolkit";

const dailyVisitorsSlice = createSlice({
  name: "dailyVisitors",
  initialState: {
    visitors: [],
    selectedDrivers: [],
  },
  reducers: {
    addVisitor(state, action) {
      state.visitors.push(action.payload);
    },
    removeVisitor(state, action) {
      state.visitors = state.visitors.filter(v => v.id !== action.payload);
    },
    addToSelected(state, action) {
      state.selectedDrivers.push(action.payload);
    },
  },
});

export const { addVisitor, removeVisitor, addToSelected } = dailyVisitorsSlice.actions;
export default dailyVisitorsSlice.reducer;
