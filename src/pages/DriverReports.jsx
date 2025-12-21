import React, { useEffect, useState } from "react";
import { fetchDriverReports } from "../api/driverReportApi";

// ======= STYLES =======
const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
  gap: "16px",
  marginBottom: "20px",
};

const cardStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  textAlign: "center",
  background: "#f9f9f9",
};

const filterBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  textAlign: "left",
  marginBottom: "20px",
};

// ======= SUMMARY CARD COMPONENT =======
const SummaryCard = ({ title, value }) => {
  return (
    <div style={cardStyle}>
      <h4>{title}</h4>
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>{value || 0}</p>
    </div>
  );
};

// ======= MAIN COMPONENT =======
const DriverReports = () => {
  const [summary, setSummary] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    stage: "",
    verification: "",
  });

  useEffect(() => {
    loadReports();
  }, [filters]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetchDriverReports(filters);
      setSummary(res.data.summary);
      setDrivers(res.data.drivers);
    } catch (err) {
      console.error("Error loading driver reports", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Driver Reports</h2>

      {/* ================= SUMMARY ================= */}
      <div style={cardGrid}>
        <SummaryCard title="Visitors" value={summary.visitors} />
        <SummaryCard title="Selected Visitors" value={summary.selectedVisitors} />
        <SummaryCard title="Registered Drivers" value={summary.registeredDrivers} />
        <SummaryCard title="Documents Uploaded" value={summary.documentsUploaded} />
        <SummaryCard title="Verification Pending" value={summary.verificationPending} />
        <SummaryCard title="GDC Generated" value={summary.gdcGenerated} />
      </div>

      {/* ================= FILTERS ================= */}
      <div style={filterBox}>
        <select name="stage" onChange={handleFilterChange} value={filters.stage}>
          <option value="">All Stages</option>
          <option value="REGISTERED">Registered</option>
          <option value="DOCUMENTS_UPLOADED">Documents Uploaded</option>
          <option value="VERIFIED">Verified</option>
          <option value="GDC_GENERATED">GDC Generated</option>
        </select>

        <select
          name="verification"
          onChange={handleFilterChange}
          value={filters.verification}
        >
          <option value="">All Verification</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
        </select>
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
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No data found
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
                    <button onClick={() => alert(`View ${d.driverId}`)}>View</button>
                    {d.stage === "VERIFIED" && !d.gdcNumber && (
                      <button style={{ marginLeft: "6px" }}>Generate GDC</button>
                    )}
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
