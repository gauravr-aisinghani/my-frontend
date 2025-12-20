import React from "react";
import SidebarLayout from "../components/SidebarLayout";
import { Outlet } from "react-router-dom";
import axios from "../api/axiosConfig";

export default function AdminPage() {
const handleLogout = async () => {
  const confirmLogout = window.confirm("Are you sure you want to logout?");

  if (!confirmLogout) return; // ❌ Cancel pressed → do nothing

  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
  } catch (err) {
    console.log("Logout error:", err);
  }

  window.location.href = "/";
};


  return (
    <SidebarLayout onLogout={handleLogout}>
      <Outlet />
    </SidebarLayout>
  );
}
