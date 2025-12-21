import React, { useEffect, useState } from "react";
import { fetchDriverReports } from "../api/driverReportApi";

const DriverReports = () => {
  const [summary, setSummary] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [filters, setFilters] = useState({
    status: "",
    verification: "",
    payment: ""
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
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Driver Reports</h2>

      {/* ================= SUMMARY CARDS ================= */}
      <div style={cardGrid}>
        <SummaryCard title="Visitor Drivers" value={summary.visitor} />
        <SummaryCard title="Registered Drivers" value={summary.registered} />
        <SummaryCard title="Approved Drivers" value={summary.approved} />
        <SummaryCard title="Verification Pending" value={summary.verificationPending} />
        <SummaryCard title="GDC Not Generated" value={summary.gdcNotGenerated} />
        <SummaryCard title="Payment Pending" value={summary.paymentPending} />
      </div>

      {/* ================= FILTERS ================= */}
      <div style={filterBox}>
        <select name="status" onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="VISITOR">Visitor</option>
          <option value="REGISTERED">Registered</option>
          <option value="APPROVED">Approved</option>
        </select>

        <select name="verification" onChange={handleFilterChange}>
          <option value="">All Verification</option>
          <option value="PENDING">Pending</option>
          <option value="DONE">Done</option>
        </select>

        <select name="payment" onChange={handleFilterChange}>
          <option value="">All Payment</option>
          <option value="PAID">Paid</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* ================= DRIVER TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>Driver ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Status</th>
              <th>Verification</th>
              <th>GDC</th>
              <th>Payment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            ) : (
              drivers.map((d) => (
                <tr key={d.id}>
                  <td>{d.id}</td>
                  <td>{d.name}</td>
                  <td>{d.mobile}</td>
                  <td>{d.status}</td>
                  <td>{d.verificationStatus}</td>
                  <td>{d.gdcGenerated ? "Generated" : "Not Generated"}</td>
                  <td>{d.paymentStatus}</td>
                  <td>
                    <button onClick={() => alert(`View ${d.id}`)}>
                      View
                    </button>

                    {/* Conditional control */}
                    {!d.gdcGenerated && d.status === "APPROVED" && d.paymentStatus === "PAID" && (
                      <button style={{ marginLeft: "5px" }}>
                        Generate GDC
                      </button>
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

/* ================= STYLES ================= */

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginBottom: "20px"
};

const filterBox = {
  display: "flex",
  gap: "10px",
  marginBottom: "15px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

/* ================= COMPONENT ================= */

const SummaryCard = ({ title, value }) => (
  <div style={cardStyle}>
    <h4>{title}</h4>
    <h2>{value || 0}</h2>
  </div>
);

const cardStyle = {
  background: "#f5f5f5",
  padding: "15px",
  borderRadius: "8px",
  textAlign: "center"
};
