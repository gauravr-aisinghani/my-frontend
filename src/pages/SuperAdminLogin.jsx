import { useState } from "react";
import superAdminApi from "../api/superadminapi";
import { useNavigate } from "react-router-dom";

export default function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const res = await superAdminApi.post(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );

    console.log("Login response:", res.data);
    navigate("/super-admin-dashboard");
  } catch (err) {
    setError("Invalid email or password");
  }
};


  return (
    <div style={{ width: 350, margin: "100px auto", textAlign: "center" }}>
      <h2>Super Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        style={{ width: "100%", padding: 10, marginTop: 10 }}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        style={{ width: "100%", padding: 10, marginTop: 10 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: 10,
          marginTop: 15,
          background: "black",
          color: "white",
        }}
      >
        Login
      </button>

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}
    </div>
  );
}
