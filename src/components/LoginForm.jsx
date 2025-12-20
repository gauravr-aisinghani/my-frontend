import React, { useState } from "react";
import axios from "../api/axiosConfig"; // baseURL set to backend
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Post to correct login endpoint
      await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true } // important for cookies
      );

      // Navigate to frontend dashboard route
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4 rounded-md"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded-md"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-md"
        >
          Login
        </button>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <p
  onClick={() => navigate("/forgot-password")}
  className="text-blue-600 text-sm mt-2 text-center cursor-pointer"
>
  Forgot Password?
</p>

       
      </form>
    </div>
  );
}

export default LoginForm;
