import api from "./axiosInstance";

/**
 * Mobile based login (Driver / Transporter)
 * POST /api/auth/login
 */
export const loginWithMobile = async (mobileNumber, role) => {
  const res = await api.post("/api/generalauth/generallogin", {
    mobileNumber,
    role,
  });

  return res.data;
};
