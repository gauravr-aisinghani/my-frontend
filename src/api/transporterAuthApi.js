import api from "./axiosInstance";

/**
 * Driver / Transporter login
 * POST /api/auth/login
 */
export const loginWithMobile = async (mobile, role) => {
  const res = await api.post("/api/generalauth/generallogin", {
    mobile: mobile, // ✅ snake_case
    role: role
  });

  return res.data;
};
