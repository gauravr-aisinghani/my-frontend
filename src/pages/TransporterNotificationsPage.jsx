import React, { useEffect, useState } from "react";
import { Bell, Truck, CreditCard } from "lucide-react";
import {
  createAdvancePaymentOrder,
  verifyPayment,
} from "../api/paymentsApi";
import {
  getTransporterNotifications,
  markNotificationRead,
} from "../api/transporterNotificationApi";

const PAGE_SIZE = 5;

export default function TransporterNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const userContext = JSON.parse(localStorage.getItem("user_context") || "{}");
  const mobile = userContext?.user_id;
  const gdc_number = userContext?.gdc_number;

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

  // 🔥 ADVANCE PAYMENT + MARK AS READ
  const handleAdvancePayment = async (notificationId, reference_id) => {
    try {
      const order = await createAdvancePaymentOrder({
        gdc_number,
        type: "TRANSPORTER",
        purpose: "TRANSPORTER_ADVANCE",
        request_id: reference_id,
      });

      const options = {
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: "Driver Advance",
        handler: async (res) => {
          // ✅ verify payment
          await verifyPayment(res);

          // 🔥 mark as read just like original working code
          await markNotificationRead(notificationId);

          alert("Advance paid successfully ✅");

          // 🔁 fetch again so UI updates
          fetchNotifications();
        },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Advance payment failed ❌");
    }
  };

  const start = (page - 1) * PAGE_SIZE;
  const pageData = notifications.slice(start, start + PAGE_SIZE);
  const totalPages = Math.ceil(notifications.length / PAGE_SIZE);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-3">
        <Bell className="text-green-600" /> Transporter Notifications
      </h1>

      {loading && <p>Loading…</p>}

      {pageData.map((n) => (
        <div
          key={n.id}
          className={`border p-6 rounded-2xl mb-4 ${
            n.isRead ? "bg-white" : "bg-green-50 border-green-400"
          }`}
        >
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <Truck /> {n.title}
            </div>
            <span className="text-xs">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>

          <p className="mt-2 text-sm">{n.message}</p>

          {/* 🔥 MAKE ADVANCE BUTTON */}
          {!n.isRead && n.reference_id && (
            <button
              onClick={() =>
                handleAdvancePayment(n.id, n.reference_id)
              }
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg"
            >
              <CreditCard size={14} className="inline mr-2" />
              Make Driver Advance
            </button>
          )}
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-10">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
