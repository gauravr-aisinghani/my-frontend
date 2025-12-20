import React, { useEffect, useRef } from "react";

const SessionTimer = ({ secondsLeft, onExtend }) => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  const popupShownRef = useRef(false);

  // ⭐ Popup only once in last 2 minutes
  useEffect(() => {
    if (secondsLeft <= 120 && secondsLeft > 0 && !popupShownRef.current) {
      popupShownRef.current = true; // prevent multiple popups

      const extend = window.confirm(
        `⚠️ Your session will expire in ${Math.floor(secondsLeft / 60)} minutes. Extend session?`
      );

      if (extend) {
        onExtend();
        popupShownRef.current = false; // allow popup again if extended
      }
    }

    // Reset popup if user increased TTL manually from backend
    if (secondsLeft > 120) {
      popupShownRef.current = false;
    }
  }, [secondsLeft, onExtend]);

  return (
    <div style={{
      position: "fixed",
      bottom: 10,
      right: 10,
      padding: 10,
      background: "#fff",
      borderRadius: 8,
      boxShadow: "0 0 4px rgba(0,0,0,0.3)"
    }}>
      ⏱️ Session Time Left:{" "}
      <strong>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </strong>
    </div>
  );
};

export default SessionTimer;
