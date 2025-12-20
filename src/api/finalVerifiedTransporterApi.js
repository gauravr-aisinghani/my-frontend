// ✅ Import axios configuration (your centralized API instance)
import api from "./axiosConfig";

// =======================================================
// 🧪 MOCK API (For local frontend testing without backend)
// =======================================================
let mockTransporters = [];

export const saveFinalVerifiedTransporter = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockTransporters.push({ id: mockTransporters.length + 1, ...data });
      resolve({ success: true, data });
    }, 300);
  });
};

export const getAllFinalVerifiedTransporters = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTransporters);
    }, 300);
  });
};

// =======================================================
// 🌐 REAL BACKEND API (Spring Boot or any REST API)
// Uncomment these when your backend is ready.
// =======================================================

// export const saveFinalVerifiedTransporter = async (data) => {
//   try {
//     const res = await api.post("/final-verified-transporter", data);
//     return res.data;
//   } catch (error) {
//     console.error("Error saving transporter:", error);
//     throw error;
//   }
// };

// export const getAllFinalVerifiedTransporters = async () => {
//   try {
//     const res = await api.get("/final-verified-transporters");
//     return res.data;
//   } catch (error) {
//     console.error("Error fetching transporters:", error);
//     throw error;
//   }
// };
