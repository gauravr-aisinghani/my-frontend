import api from "./axiosInstance";

/**
 * MOCK FLOW:
 * 1. Backend mobile check karega
 * 2. Agar mobile exist karta hai → OTP generate
 * 3. Agar nahi → exists = false
 */

export const checkTransporterMobile = async (mobile) => {
  // MOCK REGISTERED MOBILE NUMBERS
  const registeredMobiles = [
    "9876543210",
    "9123456789",
    "9999999999",
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      if (registeredMobiles.includes(mobile)) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        resolve({
          exists: true,
          otp,
        });
      } else {
        resolve({
          exists: false,
        });
      }
    }, 800);
  });

  /**
   * REAL BACKEND (future):
   * return api.post("/api/transporter/check-mobile", { mobile });
   */
};
