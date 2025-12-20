// src/api/driverRegistrationApi.js
import api from "./axiosConfig"; // your axios config (baseURL etc)

// In-memory mock store for testing
let mockDrivers = [];

/**
 * Mock save
 * Accepts object or FormData (we convert if needed)
 */
export const saveDriverRegistrationMock = async (payload) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const id = mockDrivers.length + 1;
      let entry;
      if (payload instanceof FormData) {
        // convert FormData to plain object (for mock)
        entry = Object.fromEntries(Array.from(payload.entries()));
      } else {
        entry = { ...payload };
      }

      const created = {
        id,
        wtlId: `WTL-D-${10000 + id}`,
        createdAt: new Date().toISOString(),
        ...entry,
      };
      mockDrivers.push(created);
      resolve({ success: true, data: created });
    }, 600);
  });
};

export const getAllDriverRegistrationsMock = async () =>
  new Promise((resolve) => setTimeout(() => resolve(mockDrivers), 300));

// ========== Exported API used by app (mock by default) ==========
export const saveDriverRegistration = saveDriverRegistrationMock;
export const getAllDriverRegistrations = getAllDriverRegistrationsMock;

// ========== REAL BACKEND USAGE (uncomment when ready) ==========
// export const saveDriverRegistration = async (payload) => {
//   // If payload contains files, send FormData and set multipart header
//   if (payload instanceof FormData) {
//     const res = await api.post("/drivers", payload, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return res.data;
//   } else {
//     const res = await api.post("/drivers", payload);
//     return res.data;
//   }
// };

// export const getAllDriverRegistrations = async () => {
//   const res = await api.get("/drivers");
//   return res.data;
// };
