import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/verify-otp", { email, otp });
      setMessage(res.data);
      if (res.data.includes("verified")) {
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (err) {
      setMessage("Invalid OTP or email. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Verify Email</h2>

        <input
          type="email"
          placeholder="Registered Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4 rounded-md"
        />

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="border p-2 w-full mb-4 rounded-md"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-md"
        >
          Verify
        </button>

        {message && <p className="text-center mt-3">{message}</p>}
      </form>
    </div>
  );
}

export default VerifyEmail;
