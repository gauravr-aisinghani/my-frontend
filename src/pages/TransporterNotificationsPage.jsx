import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import {
  Bell,
  Truck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from "lucide-react";
import { createPaymentOrder, verifyPayment } from "../api/paymentsApi";

const PAGE_SIZE = 5;

export default function TransporterNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [requestCache, setRequestCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [page, setPage] = useState(1);

  const userContext = JSON.parse(localStorage.getItem("user_context") || "{}");
  const transporterMobile = userContext?.mobile;
  const gdc_number = userContext?.gdc_number;

  // ===== FETCH TRANSPORTER NOTIFICATIONS =====
  const fetchNotifications = async () => {
    try {
      const res = await api.get(
        `/api/notifications/transporter/${transporterMobile}`
      );
      setNotifications(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // ===== FETCH REQUEST DETAILS =====
  const fetchRequestDetail = async (requestId) => {
    if (requestCache[requestId]) return;

    try {
      const res = await api.get(`/api/driver-request/${requestId}`);
      const data = res.data
        ? {
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
      console.error(e);
    }
  };

  // ===== MAKE ADVANCE PAYMENT =====
  const makeAdvancePayment = async (notification) => {
    try {
      setPayingId(notification.id);

      const order = await createPaymentOrder({
        gdc_number,
        type: "TRANSPORTER",
        purpose: "TRANSPORTER_ADVANCE",
      });

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Driver Advance Payment",
        handler: async (response) => {
          await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          alert("Advance payment successful ✅");

          await api.post(
            `/api/notifications/transporter/mark-read/${notification.id}`
          );

          fetchNotifications();
        },
        theme: { color: "#16a34a" },
      };

      new window.Razorpay(options).open();
    } catch (e) {
      console.error(e);
      alert("Payment failed");
    } finally {
      setPayingId(null);
    }
  };

  // ===== MARK AS READ =====
  const markAsRead = async (id) => {
    await api.post(`/api/notifications/transporter/mark-read/${id}`);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const toggleExpand = (n) => {
    setExpanded(expanded === n.id ? null : n.id);
    if (n.reference_id) fetchRequestDetail(n.reference_id);
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
        <Bell className="text-green-600" />
        Transporter Notifications
      </h1>

      {loading && <p className="text-gray-500">Loading notifications…</p>}

      <div className="space-y-6">
        {pageData.map((n) => {
          const request = requestCache[n.reference_id];

          return (
            <div
              key={n.id}
              className={`rounded-2xl border p-6 shadow-sm ${
                n.is_read
                  ? "bg-white border-gray-200"
                  : "bg-green-50 border-green-400"
              }`}
            >
              {/* HEADER */}
              <div className="flex justify-between">
                <div className="flex gap-2 items-center">
                  <Truck className="text-green-600" />
                  <h2 className="font-semibold">{n.title}</h2>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(n.created_at).toLocaleString()}
                </span>
              </div>

              <p className="text-sm text-gray-600 mt-2">{n.message}</p>

              {/* DETAILS */}
              <button
                onClick={() => toggleExpand(n)}
                className="mt-4 flex gap-2 px-4 py-2 border rounded-lg text-green-600 hover:bg-green-50"
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

              {expanded === n.id && request && (
                <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-sm">
                  <p>
                    <b>GDC:</b> {request.gdcNumber}
                  </p>
                  <p>
                    <b>Route:</b> {request.route}
                  </p>
                  <p>
                    <b>Salary:</b> ₹{request.monthlySalary}
                  </p>
                </div>
              )}

              {/* ACTIONS */}
              <div className="mt-6 flex gap-4 flex-wrap">
                <button
                  disabled={payingId === n.id || n.is_read}
                  onClick={() => makeAdvancePayment(n)}
                  className="px-5 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                >
                  <CreditCard size={16} className="inline mr-1" />
                  Pay 20% Advance
                </button>

                {!n.is_read && (
                  <button
                    onClick={() => markAsRead(n.id)}
                    className="px-4 py-2 rounded-lg bg-green-100 text-green-700"
                  >
                    <CheckCircle size={16} className="inline mr-1" />
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
            className="px-4 py-2 rounded border"
          >
            Prev
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded border"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
