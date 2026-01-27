import React, { useEffect, useState } from "react";
import { Bell, Truck, CheckCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getTransporterNotifications,
  markNotificationRead,
} from "../api/transporterNotificationApi";

const PAGE_SIZE = 5;

export default function TransporterNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  const userContext = JSON.parse(localStorage.getItem("user_context") || "{}");
  const mobile = userContext?.user_id;

  const fetchNotifications = async () => {
    if (!mobile) return;
    setLoading(true);
    const data = await getTransporterNotifications(mobile);
    setNotifications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [mobile]);

  const start = (page - 1) * PAGE_SIZE;
  const pageData = notifications.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-3">
        <Bell className="text-green-600" /> Transporter Notifications
      </h1>

      {loading && <p>Loading...</p>}

      {pageData.map((n) => {
        const requiresPayment = n.purpose === "TRANSPORTER_ADVANCE";

        return (
          <div
            key={n.id}
            className={`mb-6 rounded-2xl p-6 shadow-sm hover:shadow-md transition
              ${n.isRead ? "bg-white" : "bg-green-50 border border-green-300"}`}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className="bg-green-100 p-2 rounded-xl text-green-600">
                  <Truck size={18} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{n.title}</h3>
                  <p className="text-xs text-gray-500">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {!n.isRead && (
                <span className="text-xs bg-green-600 text-white px-3 py-1 rounded-full">
                  New
                </span>
              )}
            </div>

            {/* MESSAGE */}
            <p className="mt-4 text-sm text-gray-700">
              {n.message}{" "}
              {n.amount && (
                <span className="font-semibold text-green-600">
                  ₹{n.amount}
                </span>
              )}
            </p>

            {/* ACTIONS */}
            <div className="mt-6 flex gap-3 flex-wrap">
              {!n.isRead && (
                <button
                  onClick={async () => {
                    await markNotificationRead(n.id);
                    fetchNotifications();
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm flex items-center gap-2"
                >
                  <CheckCircle size={14} /> Mark as read
                </button>
              )}

              {requiresPayment && (
                <button
                  onClick={() =>
                    navigate(
                      `/transporter-dashboard?pay=true&amount=${n.amount}&purpose=${n.purpose}`
                    )
                  }
                  className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm flex items-center gap-2"
                >
                  <CreditCard size={16} /> Make Payment
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg border disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg border disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
