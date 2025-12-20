import React from "react";
import { useSelector } from "react-redux";

export default function GlobalLoader() {
  const isLoading = useSelector((state) => state.loading.isLoading);

  if (!isLoading) return null;

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
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  loader: {
    width: "70px",
    height: "70px",
    border: "8px solid #fff",
    borderTop: "8px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
