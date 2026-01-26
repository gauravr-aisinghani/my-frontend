import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { Bell, Truck, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const PAGE_SIZE = 5;

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [requestCache, setRequestCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // ===== FETCH NOTIFICATIONS =====
  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications/admin/ADMIN");
      setNotifications(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH REQUEST DETAIL =====
  const fetchRequestDetail = async (requestId) => {
    if (requestCache[requestId]) return;

    try {
      const res = await api.get(`/api/driver-request/${requestId}`);
      // convert keys to camelCase for frontend
      const data = res.data
        ? {
            transporterRegistrationId: res.data.transporter_registration_id,
            gdcNumber: res.data.gdc_number,
            route: res.data.route,
            monthlySalary: res.data.monthly_salary,
          }
        : null;

      setRequestCache((prev) => ({
        ...prev,
        [requestId]: data,
      }));
    } catch (e) {
      console.error("Failed to fetch request", e);
    }
  };

  // ===== MARK AS READ =====
  const markAsRead = async (id) => {
    try {
      await api.post(`/api/notifications/admin/mark-read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const toggleExpand = (n) => {
    if (expanded === n.id) {
      setExpanded(null);
    } else {
      setExpanded(n.id);
      if (n.reference_id) fetchRequestDetail(n.reference_id);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ===== PAGINATION =====
  const start = (page - 1) * PAGE_SIZE;
  const pageData = notifications.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-3">
        <Bell className="text-blue-600" />
        Admin Notifications
      </h1>

      {loading && <p className="text-gray-500">Loading notifications…</p>}

      {!loading && pageData.length === 0 && (
        <p className="text-gray-500">No notifications</p>
      )}

      <div className="space-y-6">
        {pageData.map((n) => {
          const request = requestCache[n.reference_id];

          return (
            <div
              key={n.id}
              className={`rounded-2xl border p-6 transition shadow-sm hover:shadow-md ${
                n.is_read ? "bg-white border-gray-200" : "bg-blue-50 border-blue-400"
              }`}
            >
              {/* HEADER */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Truck className="text-blue-600" />
                  <h2 className="text-lg font-semibold">{n.title}</h2>
                </div>

                <span className="text-xs text-gray-400">
                  {n.created_at
                    ? new Date(n.created_at).toLocaleString()
                    : "Invalid Date"}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2">{n.message}</p>

              {/* EXPAND */}
              {n.type === "DRIVER_REQUEST" && (
                <>
                 <button
  onClick={() => toggleExpand(n)}
  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
>
  {expanded === n.id ? (
    <>
      <ChevronUp size={16} /> Hide details
    </>
  ) : (
    <>
      <ChevronDown size={16} /> View details
    </>
  )}
</button>


                  {expanded === n.id && (
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
                      {!request && (
                        <p className="text-gray-500 col-span-2">
                          Loading request…
                        </p>
                      )}

                      {request && (
                        <>
                          <p>
                            <b>Transporter Reg ID:</b>{" "}
                            {request.transporterRegistrationId}
                          </p>
                          <p>
                            <b>GDC Number:</b> {request.gdcNumber}
                          </p>
                          <p>
                            <b>Route:</b> {request.route}
                          </p>
                          <p>
                            <b>Salary:</b> ₹{request.monthlySalary}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* ACTIONS */}
              <div className="mt-6 flex flex-wrap gap-4 items-center">
                <button
                  onClick={() =>
                    alert(
                      `Future: check drivers for request ${n.reference_id}`
                    )
                  }
                  className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 min-w-[200px]"
                >
                  Check Driver Availability
                </button>

                {!n.is_read && (
                <button
  onClick={() => markAsRead(n.id)}
  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
>
  <CheckCircle size={16} />
  Mark as read
</button>

                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-10">
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
