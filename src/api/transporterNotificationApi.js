import api from "./axiosInstance";

const API_BASE = "/api/notifications";

export const getTransporterNotifications = async (mobile) => {
  const res = await api.get(`${API_BASE}/transporter/${mobile}`, {
    headers: { "Cache-Control": "no-cache" },
  });

  return res.data.map((n) => ({
    ...n,
    isRead: n.is_read,
    createdAt: n.created_at,
    referenceId: n.reference_id,
  }));
};

export const markNotificationRead = async (id) => {
  await api.post(`${API_BASE}/mark-read/${id}`);
};
