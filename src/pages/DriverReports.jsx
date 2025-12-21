import React, { useEffect, useState } from "react";
import { fetchDriverReports } from "../api/driverReportApi";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

// ================= STYLES =================
const pageStyle = { padding: "20px" };

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const card = {
  padding: "16px",
  borderRadius: "12px",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  textAlign: "center",
};

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

// ================= COMPONENT =================
const DriverReports = () => {
  const [summary, setSummary] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [filters, setFilters] = useState({ stage: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchDriverReports(filters);
      setSummary(res.summary || {});
      setDrivers(res.drivers || []);
    } finally {
      setLoading(false);
    }
  };

  // ================= EXCEL EXPORT =================
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(drivers);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Driver Reports");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([excelBuffer]), "driver_reports.xlsx");
  };

  // ================= CHART DATA =================
  const barData = [
    { name: "Visitors", value: summary.visitors || 0 },
    { name: "Selected", value: summary.selectedVisitors || 0 },
    { name: "Registered", value: summary.registeredDrivers || 0 },
    { name: "GDC", value: summary.gdcGenerated || 0 },
  ];

  const pieData = [
    { name: "GDC Generated", value: summary.gdcGenerated || 0 },
    {
      name: "Pending",
      value:
        (summary.registeredDrivers || 0) - (summary.gdcGenerated || 0),
    },
  ];

  const COLORS = ["#16a34a", "#0ea5e9"];

  return (
    <div style={pageStyle}>
      <h2>Drivers Reports</h2>

      {/* ================= KPI CARDS ================= */}
      <div style={cardGrid}>
        <div style={card}><h4>Visitors</h4><b>{summary.visitors || 0}</b></div>
        <div style={card}><h4>Selected Visitors</h4><b>{summary.selectedVisitors || 0}</b></div>
        <div style={card}><h4>Registered Drivers</h4><b>{summary.registeredDrivers || 0}</b></div>
        <div style={card}><h4>Verification Pending</h4><b>{summary.verificationPending || 0}</b></div>
        <div style={card}><h4>GDC Generated</h4><b>{summary.gdcGenerated || 0}</b></div>
      </div>

      {/* ================= CHARTS ================= */}
      <div style={sectionGrid}>
        <div style={card}>
          <h4>Driver Funnel Overview</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <h4>GDC Overview</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={pieData} dataKey="value" innerRadius={60}>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
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
          name="stage"
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
              <tr><td colSpan="7" align="center">No data found</td></tr>
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
