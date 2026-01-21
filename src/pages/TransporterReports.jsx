import React, { useEffect, useState } from "react";
import { fetchTransporterReports } from "../api/transporterReportApi";
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
  registered: "#0ea5e9",
  verified: "#22c55e",
  gdc: "#ef4444",
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

const filterBox = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "16px",
};

/* ================= PAGINATION ================= */
const PAGE_SIZE = 5;

/* ================= COMPONENT ================= */
const TransporterReports = () => {
  const [summary, setSummary] = useState({});
  const [transporters, setTransporters] = useState([]);
  const [filters, setFilters] = useState({ stage: "" });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchTransporterReports(filters);

      // 🔽 Snake case support
      setSummary(res?.summary || {});
      setTransporters(res?.transporters || []);

      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  /* ================= EXCEL EXPORT ================= */
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(transporters);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transporter Reports");
    XLSX.writeFile(wb, "transporter_reports.xlsx");
  };

  /* ================= CHART DATA ================= */
  const barData = [
    {
      name: "Registered",
      value: summary.registered_transporters || 0,
      color: COLORS.registered,
    },
    {
      name: "Verified",
      value: summary.verified_transporters || 0,
      color: COLORS.verified,
    },
    {
      name: "GDC Generated",
      value: summary.gdc_generated || 0,
      color: COLORS.gdc,
    },
  ];

  const pieData = [
    {
      name: "GDC Generated",
      value: summary.gdc_generated || 0,
      color: COLORS.gdc,
    },
    {
      name: "Pending",
      value:
        (summary.registered_transporters || 0) -
        (summary.gdc_generated || 0),
      color: COLORS.registered,
    },
  ];

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(transporters.length / PAGE_SIZE);

  const paginatedData = transporters.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2>Transporter Reports</h2>

      {/* ================= KPI CARDS ================= */}
      <div style={cardGrid}>
        <div style={card(COLORS.registered)}>
          <h4>Registered</h4>
          <b>{summary.registered_transporters || 0}</b>
        </div>

        <div style={card(COLORS.verified)}>
          <h4>Verified</h4>
          <b>{summary.verified_transporters || 0}</b>
        </div>

        <div style={card("#f59e0b")}>
          <h4>Verification Pending</h4>
          <b>{summary.verification_pending || 0}</b>
        </div>

        <div style={card(COLORS.gdc)}>
          <h4>GDC Generated</h4>
          <b>{summary.gdc_generated || 0}</b>
        </div>
      </div>

      {/* ================= CHARTS ================= */}
      <div style={sectionGrid}>
        <div style={card("#e5e7eb")}>
          <h4>Transporter Funnel</h4>
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
          <h4>GDC Overview</h4>
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

      {/* ================= FILTER + EXPORT ================= */}
      <div style={filterBox}>
        <select
          value={filters.stage}
          onChange={(e) => setFilters({ stage: e.target.value })}
        >
          <option value="">All Stages</option>
          <option value="REGISTERED">Registered</option>
          <option value="VERIFIED">Verified</option>
          <option value="GDC_GENERATED">GDC Generated</option>
        </select>

        <button onClick={downloadExcel}>⬇ Export Excel</button>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <table style={tableStyle} border="1">
            <thead>
              <tr>
                <th>ID</th>
                <th>Company</th>
                <th>Owner Mobile</th>
                <th>Stage</th>
                <th>Verification</th>
                <th>GDC</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" align="center">
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((t) => (
                  <tr key={t.transporter_id}>
                    <td>{t.transporter_id}</td>
                    <td>{t.company_name}</td>
                    <td>{t.owner_mobile}</td>
                    <td>{t.stage}</td>
                    <td>{t.verification_status || "PENDING"}</td>
                    <td>{t.gdc_number || "Not Generated"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ================= PAGINATION ================= */}
          {totalPages > 1 && (
            <div style={{ marginTop: "12px", textAlign: "center" }}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      margin: "0 4px",
                      fontWeight:
                        currentPage === page ? "bold" : "normal",
                    }}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TransporterReports;
