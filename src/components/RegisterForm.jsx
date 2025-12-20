import React, { useState } from "react";
import { sendOtp, verifyOtp, registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: password
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await sendOtp(email);
      setMessage(res.message || "OTP sent to your email!");
      setStep(2);
    } catch (err) {
      setMessage(err.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await verifyOtp(email, otp);
      setMessage(res.message || "Email verified successfully!");
      setStep(3);
    } catch (err) {
      setMessage(err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 3: Register User
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerUser(email, password);
      setMessage(res.message || "Registered successfully!");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMessage(err.message || "Error registering user!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={
          step === 1
            ? handleSendOtp
            : step === 2
            ? handleVerifyOtp
            : handleRegister
        }
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          {step === 1
            ? "Register - Verify Email"
            : step === 2
            ? "Enter OTP"
            : "Set Password"}
        </h2>

        {/* Step 1: Email input */}
        {step === 1 && (
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
        )}

        {/* Step 2: OTP input */}
        {step === 2 && (
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
        )}

        {/* Step 3: Password input */}
        {step === 3 && (
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full mb-4 rounded-md"
            required
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white w-full py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : step === 1
            ? "Send OTP"
            : step === 2
            ? "Verify OTP"
            : "Register"}
        </button>

        {message && (
          <p className="text-center mt-3 text-gray-700 font-medium">{message}</p>
        )}

        <p
          onClick={() => navigate("/")}
          className="text-blue-600 text-sm mt-4 text-center cursor-pointer"
        >
          Already have an account? Login
        </p>
      </form>
    </div>
  );
}

export default RegisterForm;
