import React, { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  CreditCard,
} from "lucide-react";
import { useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import {
  createPaymentOrder,
  verifyPayment,
} from "../api/paymentsApi";
import {
  getTransporterNotifications,
  markNotificationRead,
} from "../api/transporterNotificationApi";

const PAGE_SIZE = 5;

export default function TransporterNotificationsPage() {
  const { mobile } = useParams(); // ✅ MAIN FIX

  const [notifications, setNotifications] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [requestCache, setRequestCache] = useState({});
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [page, setPage] = useState(1);

  const userContext = JSON.parse(
    localStorage.getItem("user_context") || "{}"
  );
  const gdc_number = userContext?.gdc_number;

  const fetchNotifications = async () => {
    if (!mobile) return;
    try {
      setLoading(true);
      const data =
        await getTransporterNotifications(
          mobile
        );
      setNotifications(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [mobile]);

  const fetchRequestDetail = async (id) => {
    if (!id || requestCache[id]) return;
    const res = await api.get(
      `/api/driver-request/${id}`
    );
    if (!res.data) return;

    setRequestCache((p) => ({
      ...p,
      [id]: {
        gdcNumber: res.data.gdc_number,
        route: res.data.route,
        monthlySalary: res.data.monthly_salary,
      },
    }));
  };

  const makeAdvancePayment = async (n) => {
    try {
      setPayingId(n.id);
      const order =
        await createPaymentOrder({
          gdc_number,
          type: "TRANSPORTER",
          purpose: "TRANSPORTER_ADVANCE",
        });

      new window.Razorpay({
        key: order.key,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        handler: async (r) => {
          await verifyPayment(r);
          await markNotificationRead(n.id);
          fetchNotifications();
        },
      }).open();
    } finally {
      setPayingId(null);
    }
  };

  const toggleExpand = (n) => {
    setExpanded(expanded === n.id ? null : n.id);
    if (n.referenceId)
      fetchRequestDetail(n.referenceId);
  };

  const start = (page - 1) * PAGE_SIZE;
  const pageData = notifications.slice(
    start,
    start + PAGE_SIZE
  );
  const totalPages = Math.ceil(
    notifications.length / PAGE_SIZE
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-8">
        Transporter Notifications
      </h1>

      {loading && (
        <p>Loading notifications…</p>
      )}

      {pageData.map((n) => {
        const request =
          requestCache[n.referenceId];
        return (
          <div
            key={n.id}
            className={`rounded-2xl border p-6 mb-5 ${
              n.isRead
                ? "bg-white"
                : "bg-green-50 border-green-400"
            }`}
          >
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <Truck className="text-green-600" />
                <b>{n.title}</b>
              </div>
              <small>
                {new Date(
                  n.createdAt
                ).toLocaleString()}
              </small>
            </div>

            <p className="mt-2">{n.message}</p>

            {n.referenceId && (
              <button
                onClick={() => toggleExpand(n)}
                className="mt-3 text-green-600"
              >
                {expanded === n.id ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
            )}

            {expanded === n.id &&
              request && (
                <div className="mt-3 bg-gray-50 p-3 rounded">
                  <p>GDC: {request.gdcNumber}</p>
                  <p>Route: {request.route}</p>
                  <p>
                    Salary: ₹
                    {request.monthlySalary}
                  </p>
                </div>
              )}

            <div className="mt-4 flex gap-3">
              <button
                disabled={
                  payingId === n.id || n.isRead
                }
                onClick={() =>
                  makeAdvancePayment(n)
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                <CreditCard size={14} /> Pay
                Advance
              </button>

              {!n.isRead && (
                <button
                  onClick={() =>
                    markNotificationRead(n.id)
                  }
                  className="bg-green-100 px-4 py-2 rounded"
                >
                  <CheckCircle size={14} />{" "}
                  Mark Read
                </button>
              )}
            </div>
          </div>
        );
      })}

      {totalPages > 1 && (
        <div className="flex justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() =>
              setPage(page + 1)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
