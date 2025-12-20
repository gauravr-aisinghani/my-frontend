// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "../api/axiosConfig";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      try {
        const res = await axios.get("/api/auth/session-status", {
          withCredentials: true,
        });

        if (res.data.success === true) {
          setAllowed(true);
        } else {
          setAllowed(false);
        }
      } catch {
        setAllowed(false);
      }
      setLoading(false);
    };

    check();
  }, []);

  if (loading) return <div>Loading...</div>;

  // 🚀 FIX: Do NOT redirect back to login if already on login page
  if (!allowed && location.pathname.startsWith("/dashboard")) {
    return <Navigate to="/" replace />;
  }

  return children;
}
