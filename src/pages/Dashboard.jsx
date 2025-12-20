// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosConfig";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    // Get logged-in user
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/session-status");
        if (res.data.active) setUser(res.data.user);
        else navigate("/", { replace: true });
      } catch {
        navigate("/", { replace: true });
      }
    };
    fetchUser();

    // Frontend inactivity timer
    let timer = setTimeout(logout, 60 * 1000); // 1 minute

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(logout, 60 * 1000);
    }

    async function logout() {
      try {
        await axios.post("/api/auth/logout"); // backend logout
      } catch {}
      alert("Logged out due to inactivity");
      navigate("/", { replace: true });
    }

    // Track activity
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, [navigate]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user}!</h1>
      <p>You will be logged out automatically after 1 minute of inactivity.</p>
    </div>
  );
}

export default Dashboard;
