import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";
import SessionTimer from "./SessionTimer";

export default function SessionManager() {
  const [secondsLeft, setSecondsLeft] = useState(null);

  // 1️⃣ Load session TTL ONLY once (no polling)
  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await axios.get("/api/auth/session-status", {
          withCredentials: true,
        });

        if (res.data.success) {
          setSecondsLeft(res.data.remainingSeconds);
        } else {
          setSecondsLeft(0);
        }
      } catch (error) {
        setSecondsLeft(0);
      }
    };

    loadSession();
  }, []);

  // 2️⃣ Local 1-second countdown
  useEffect(() => {
    if (secondsLeft === null) return;

    if (secondsLeft <= 0) {
      logoutUser();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  // 3️⃣ Logout function
  const logoutUser = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
    } catch {}
    window.location.href = "/";
  };

  // 4️⃣ Extend Session
  const extendSession = async () => {
    try {
      const res = await axios.get("/api/auth/extend-session", {
        withCredentials: true,
      });
      setSecondsLeft(res.data.ttl); // set new TTL
    } catch {}
  };

  if (secondsLeft === null) return null;

  return (
    <SessionTimer secondsLeft={secondsLeft} onExtend={extendSession} />
  );
}
