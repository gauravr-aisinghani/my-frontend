import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { CheckCircle } from "lucide-react";

export default function AdminNotificationsPage() {
  const adminId = localStorage.getItem("adminId"); // ya jaha store kr rakha ho
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== FETCH ALL NOTIFICATIONS =====
  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/api/notifications/admin/${adminId}`);
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== MARK AS READ =====
  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/api/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">🔔 Notifications</h1>

      {loading && <p className="text-gray-500">Loading notifications...</p>}

      {!loading && notifications.length === 0 && (
        <p className="text-gray-500">No notifications found</p>
      )}

      <div className="space-y-4">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-xl border flex justify-between items-start ${
              n.isRead
                ? "bg-white"
                : "bg-blue-50 border-blue-300"
            }`}
          >
            <div>
              <h3 className="font-semibold text-gray-800">
                {n.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {n.message}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>

            {!n.isRead && (
              <button
                onClick={() => markAsRead(n.id)}
                className="text-blue-600 hover:text-blue-800"
                title="Mark as read"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
