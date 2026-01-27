import axios from "axios";

const API_BASE = "/api/notifications";

export const getTransporterNotifications = async (mobile) => {
  const res = await axios.get(
    `${API_BASE}/transporter/${mobile}`
  );

  return res.data.map((n) => ({
    ...n,
    isRead: n.is_read,
    createdAt: n.created_at,
    referenceId: n.reference_id,
  }));
};

export const markNotificationRead = async (id) => {
  await axios.post(
    `${API_BASE}/mark-read/${id}`
  );
};
