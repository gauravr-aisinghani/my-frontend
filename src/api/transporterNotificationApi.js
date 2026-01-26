import axios from "axios";

const API_BASE = "/api/notifications";

// 🔔 Get unread notifications for transporter
export const getTransporterNotifications = async (mobile) => {
  const res = await axios.get(
    `${API_BASE}/transporter/${mobile}`
  );
  return res.data;
};

// ✅ Mark notification as read
export const markNotificationRead = async (notificationId) => {
  await axios.post(
    `${API_BASE}/mark-read/${notificationId}`
  );
};
