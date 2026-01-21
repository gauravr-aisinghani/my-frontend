import React, { useEffect, useState } from "react";
import { fetchPaymentReports } from "../api/paymentReportApi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import * as XLSX from "xlsx";

/* ================= COLORS ================= */
const COLORS = {
  total: "#0ea5e9",
  paid: "#16a34a",
  failed: "#ef4444",
  driver: "#f59e0b",
  transporter: "#6366f1",
};

/* ================= STYLES ================= */
const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const card = (color) => ({
  padding: "16px",
  borderRadius: "12px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  textAlign: "center",
  borderTop: `4px solid ${color}`,
});

const sectionGrid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "20px",
  marginBottom: "20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
};

const filterRow = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginBottom: "16px",
  flexWrap: "wrap",
};

/* ================= PAGINATION ================= */
const PAGE_SIZE = 5;

const PaymentReports = () => {
  const [summary, setSummary] = useState({});
  const [payments, setPayments] = useState([]);
  const [filters, setFilters] = useState({
    paymentType: "",
    status: "",
    fromDate: "",
    toDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchPaymentReports(filters);
      setSummary(res?.summary || {});
      setPayments(res?.payments || []);
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXCEL EXPORT ================= */
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(payments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Payments");
    XLSX.writeFile(wb, "payment_report.xlsx");
  };

  /* ================= CHART DATA ================= */
  const barData = [
    { name: "Total", value: summary.total_payments || 0, color: COLORS.total },
    { name: "Paid", value: summary.paid_payments || 0, color: COLORS.paid },
    { name: "Failed", value: summary.failed_payments || 0, color: COLORS.failed },
  ];

  const pieData = [
    {
      name: "Driver",
      value: summary.driver_payments || 0,
      color: COLORS.driver,
    },
    {
      name: "Transporter",
      value: summary.transporter_payments || 0,
      color: COLORS.transporter,
    },
  ];

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(payments.length / PAGE_SIZE);

  const paginatedPayments = payments.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="max-w-7xl mx-auto">
      <h2>Payment Reports</h2>

      {/* ================= KPI ================= */}
      <div style={cardGrid}>
        <div style={card(COLORS.total)}>
          <h4>Total Payments</h4>
          <b>{summary.total_payments || 0}</b>
        </div>
        <div style={card(COLORS.paid)}>
          <h4>Paid</h4>
          <b>{summary.paid_payments || 0}</b>
        </div>
        <div style={card(COLORS.failed)}>
          <h4>Failed</h4>
          <b>{summary.failed_payments || 0}</b>
        </div>
        <div style={card(COLORS.driver)}>
          <h4>Driver</h4>
          <b>{summary.driver_payments || 0}</b>
        </div>
        <div style={card(COLORS.transporter)}>
          <h4>Transporter</h4>
          <b>{summary.transporter_payments || 0}</b>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div style={sectionGrid}>
        <div style={card("#e5e7eb")}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {barData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card("#e5e7eb")}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={60}>
                {pieData.map((e, i) => (
                  <Cell key={i} fill={e.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= FILTER ROW ================= */}
      <div style={filterRow}>
        <select
          value={filters.paymentType}
          onChange={(e) =>
            setFilters({ ...filters, paymentType: e.target.value })
          }
        >
          <option value="">All Types</option>
          <option value="DRIVER">Driver</option>
          <option value="TRANSPORTER">Transporter</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value })
          }
        >
          <option value="">All Status</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="CREATED">Created</option>
        </select>

        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) =>
            setFilters({ ...filters, fromDate: e.target.value })
          }
        />

        <input
          type="date"
          value={filters.toDate}
          onChange={(e) =>
            setFilters({ ...filters, toDate: e.target.value })
          }
        />

        <button onClick={downloadExcel}>⬇ Export</button>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyle} border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>GDC</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Razorpay</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPayments.length === 0 ? (
              <tr>
                <td colSpan="7" align="center">No data</td>
              </tr>
            ) : (
              paginatedPayments.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.gdc_number}</td>
                  <td>{p.payment_type}</td>
                  <td>{p.amount}</td>
                  <td>{p.status}</td>
                  <td>{p.razorpay_payment_id || "-"}</td>
                  <td>{p.created_at}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentReports;
