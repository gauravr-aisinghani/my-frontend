import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { CheckCircle, Truck } from "lucide-react";

const PAGE_SIZE = 5;

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // ===== FETCH =====
  const fetchNotifications = async () => {
    try {
      const res = await api.get(`/api/notifications/admin/ADMIN`);

      // 🔥 assume backend will give proper fields later
      const formatted = (res.data || []).map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,

        transporterName: n.transporter_name || "Unknown Transporter",
        gdcNumber: n.gdc_number || "—",
        transporterRegId: n.transporter_registration_id || "—",

        route: n.route || "—",
        salary: n.monthly_salary || null,

        isRead: n.is_read,
        createdAt: n.created_at,
      }));

      setNotifications(formatted);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ===== MARK AS READ =====
  const markAsRead = async (id) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  // ===== FUTURE ACTION =====
  const checkDriverAvailability = (requestId) => {
    alert(
      `Future flow:\nCheck available drivers for Request ID: ${requestId}`
    );
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ===== PAGINATION =====
  const start = (page - 1) * PAGE_SIZE;
  const currentPageData = notifications.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-2">
        🔔 Admin Notifications
      </h1>

      {loading && <p className="text-gray-500">Loading...</p>}

      {!loading && currentPageData.length === 0 && (
        <p className="text-gray-500">No notifications</p>
      )}

      <div className="space-y-6">
        {currentPageData.map((n) => (
          <div
            key={n.id}
            className={`rounded-2xl border p-6 shadow-sm transition ${
              n.isRead
                ? "bg-white"
                : "bg-blue-50 border-blue-400"
            }`}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Truck className="text-blue-600" />
                <h2 className="text-lg font-semibold">
                  New Driver Request
                </h2>
              </div>

              <span className="text-xs text-gray-400">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>

            {/* BODY */}
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <p>
                <span className="font-medium">Transporter:</span>{" "}
                {n.transporterName}
              </p>
              <p>
                <span className="font-medium">GDC No:</span>{" "}
                {n.gdcNumber}
              </p>
              <p>
                <span className="font-medium">Registration ID:</span>{" "}
                {n.transporterRegId}
              </p>
              <p>
                <span className="font-medium">Route:</span>{" "}
                {n.route}
              </p>
              {n.salary && (
                <p>
                  <span className="font-medium">Salary:</span> ₹
                  {n.salary}
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => checkDriverAvailability(n.id)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Check Driver Availability
              </button>

              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-3 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded border disabled:opacity-40"
          >
            Prev
          </button>

          <span className="px-4 py-2 text-sm">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded border disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
