import React from "react";
import { useSelector } from "react-redux";

export default function GlobalLoader() {
  const pendingRequests = useSelector(
    (state) => state.loading.pendingRequests
  );

  if (pendingRequests <= 0) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.loader}></div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(0,0,0,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    pointerEvents: "all", // ⛔ BLOCK CLICKS
  },
  loader: {
    width: "70px",
    height: "70px",
    border: "8px solid #fff",
    borderTop: "8px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
