import React, { useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const res = await axiosInstance.post("/api/auth/forgot-password/send-otp", { email });
      setMessage(res.data.message || res.data);
      setStep(2);
    } catch (err) {
      setMessage("Error sending OTP!");
    }
  };

  const handleResetPassword = async () => {
    try {
      const res = await axiosInstance.post("/api/auth/forgot-password/reset", {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message || res.data);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setMessage("Error resetting password!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-4 rounded-md"
            />
            <button
              onClick={handleSendOtp}
              className="bg-blue-500 text-white w-full py-2 rounded-md"
            >
              Send OTP
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 w-full mb-4 rounded-md"
            />
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border p-2 w-full mb-4 rounded-md"
            />
            <button
              onClick={handleResetPassword}
              className="bg-green-500 text-white w-full py-2 rounded-md"
            >
              Reset Password
            </button>
          </>
        )}
        {message && <p className="text-center mt-3">{message}</p>}
        <p
          onClick={() => navigate("/")}
          className="text-blue-600 text-sm mt-4 text-center cursor-pointer"
        >
          Back to Login
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
