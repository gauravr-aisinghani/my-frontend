import React, { useEffect, useState } from "react";
import { fetchDriverReports } from "../api/driverReportApi";
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

// ================= COLORS (MATCH DASHBOARD) =================
const COLORS = {
  visitors: "#16a34a",     // green
  selected: "#0ea5e9",     // blue
  registered: "#f59e0b",   // orange
  gdc: "#ef4444",          // red
  pending: "#0ea5e9",
};

// ================= STYLES =================
const pageStyle = { padding: "20px" };

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
  alignItems: "center",
  marginBottom: "16px",
};

// ================= COMPONENT =================
const DriverReports = () => {
  const [summary, setSummary] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [filters, setFilters] = useState({ stage: "" });
  const [loading, setLoading] = useState(false);

  // Load on filter change
  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchDriverReports(filters);
      setSummary(res.summary || {});
      setDrivers(res.drivers || []);
    } catch (err) {
      console.error("Error loading driver reports", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= EXCEL EXPORT =================
  const downloadExcel = () => {
    if (drivers.length === 0) return;

    const ws = XLSX.utils.json_to_sheet(drivers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Driver Reports");
    XLSX.writeFile(wb, "driver_reports.xlsx");
  };

  // ================= CHART DATA =================
  const barData = [
    { name: "Visitors", value: summary.visitors || 0, color: COLORS.visitors },
    { name: "Selected", value: summary.selected_visitors || 0, color: COLORS.selected },
    { name: "Registered", value: summary.registered_drivers || 0, color: COLORS.registered },
    { name: "GDC", value: summary.gdc_generated || 0, color: COLORS.gdc },
  ];

  const pieData = [
    { name: "GDC Generated", value: summary.gdc_generated || 0, color: COLORS.gdc },
    {
      name: "Pending",
      value:
        (summary.registered_drivers || 0) -
        (summary.gdc_generated || 0),
      color: COLORS.pending,
    },
  ];

  return (
    <div style={pageStyle}>
      <h2>Drivers Reports</h2>

      {/* ================= KPI CARDS ================= */}
      <div style={cardGrid}>
        <div style={card(COLORS.visitors)}>
          <h4>Visitors</h4>
          <b>{summary.visitors || 0}</b>
        </div>

        <div style={card(COLORS.selected)}>
          <h4>Selected Visitors</h4>
          <b>{summary.selected_visitors || 0}</b>
        </div>

        <div style={card(COLORS.registered)}>
          <h4>Registered Drivers</h4>
          <b>{summary.registered_drivers || 0}</b>
        </div>

        <div style={card(COLORS.selected)}>
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
          <h4>Driver Funnel Overview</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value">
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
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
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= FILTER + EXCEL ================= */}
      <div style={filterBox}>
        <select
          value={filters.stage}
          onChange={(e) => setFilters({ stage: e.target.value })}
        >
          <option value="">Select Stage to View Records</option>
          <option value="REGISTERED">Registered</option>
          <option value="VERIFIED">Verified</option>
          <option value="GDC_GENERATED">GDC Generated</option>
        </select>

        <button
          onClick={downloadExcel}
          disabled={drivers.length === 0}
        >
          ⬇ Export Excel
        </button>
      </div>

      {/* ================= TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyle} border="1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Stage</th>
              <th>Verification</th>
              <th>GDC</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="7" align="center">
                  Select a stage to view records
                </td>
              </tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.driverId}>
                  <td>{d.driverId}</td>
                  <td>{d.name}</td>
                  <td>{d.mobile}</td>
                  <td>{d.stage}</td>
                  <td>{d.verificationStatus || "PENDING"}</td>
                  <td>{d.gdcNumber ? "Generated" : "Not Generated"}</td>
                  <td>
                    <button>View</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DriverReports;
