import axiosInstance from "./axiosConfig";

// 🔹 Register new user
export const registerUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/api/auth/register", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// 🔹 Login user
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// 🔹 Send OTP to email for verification
export const sendOtp = async (email) => {
  try {
    const response = await axiosInstance.post("/api/auth/send-otp", { email });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// 🔹 Verify OTP after receiving it via email
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axiosInstance.post("/api/auth/verify-otp", {
      email,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};

// 🔹 Reset password (for forgot password flow)
export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axiosInstance.post("/api/auth/reset-password", {
      email,
      newPassword,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : { message: "Network error" };
  }
};
