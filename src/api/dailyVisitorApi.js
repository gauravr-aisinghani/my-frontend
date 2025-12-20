// src/api/dailyVisitorsApi.js

// TEMPORARY MOCK IMPLEMENTATION (no backend required)
let mockVisitors = []; // stores data locally in memory

export const saveDailyVisitor = async (visitorData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockVisitors.push({ id: mockVisitors.length + 1, ...visitorData });
      resolve({ success: true, data: visitorData });
    }, 500); // simulate network delay
  });
};

export const getAllDailyVisitors = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockVisitors);
    }, 300);
  });
};
