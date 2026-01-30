import React, { useEffect, useState } from "react";
import {
  getAdvancePaidTransporterRequests,
  getAvailableDrivers,
  assignDriverToRequest,
} from "../../api/driverAssignmentApi";

export default function AssignDriver() {
  const [requests, setRequests] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    assigned_driver_registration_id: "",
    remarks: "",
  });

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, driverRes] = await Promise.all([
        getAdvancePaidTransporterRequests(),
        getAvailableDrivers(),
      ]);
      setRequests(reqRes || []);
      setDrivers(driverRes || []);
    } catch (err) {
      alert("Failed to load data");
    }
  };

  // ================= ASSIGN DRIVER =================
  const handleAssign = async () => {
    if (!selectedRequest || !form.assigned_driver_registration_id) {
      alert("Please select transporter request and driver");
      return;
    }

    // 🔥 FINAL SNAKE_CASE PAYLOAD
    const payload = {
      request_id: selectedRequest.request_id,
      assigned_driver_registration_id: Number(
        form.assigned_driver_registration_id
      ),
      assigned_by: 1, // admin id (auth se aayega)
      remarks: form.remarks,
    };

    try {
      setLoading(true);
      await assignDriverToRequest(payload);
      alert("Driver assigned successfully");
      setSelectedRequest(null);
      setForm({ assigned_driver_registration_id: "", remarks: "" });
      fetchData();
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Failed to assign driver"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Assign Driver (Monthly)
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ================= LEFT : REQUESTS ================= */}
        <div className="bg-white border shadow rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Transporter</th>
                <th className="p-3 border">Route</th>
                <th className="p-3 border">Vehicle</th>
                <th className="p-3 border">Salary</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-4 text-gray-500"
                  >
                    No advance paid requests found
                  </td>
                </tr>
              )}

              {requests.map((r) => (
                <tr key={r.request_id}>
                  <td className="p-3 border">
                    {r.transporter_name || "—"}
                  </td>
                  <td className="p-3 border">{r.route}</td>
                  <td className="p-3 border">
                    {r.vehicle_grade}
                  </td>
                  <td className="p-3 border">
                    ₹{r.monthly_salary}
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => setSelectedRequest(r)}
                      className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= RIGHT : ASSIGN ================= */}
        <div className="bg-white border shadow rounded p-4 space-y-3">
          <h3 className="font-semibold text-lg">
            Assignment Details
          </h3>

          {!selectedRequest && (
            <p className="text-sm text-gray-500">
              Select a transporter request from left
            </p>
          )}

          {selectedRequest && (
            <>
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedRequest.transporter_phone}
                </p>
                <p>
                  <strong>Route:</strong>{" "}
                  {selectedRequest.route}
                </p>
                <p>
                  <strong>Vehicle:</strong>{" "}
                  {selectedRequest.vehicle_number} (
                  {selectedRequest.vehicle_grade})
                </p>
                <p>
                  <strong>Salary:</strong> ₹
                  {selectedRequest.monthly_salary}
                </p>
              </div>

              {/* DRIVER */}
              <div>
                <label className="text-sm font-medium">
                  Select Driver *
                </label>
                <select
                  className="w-full border p-2 rounded text-sm"
                  value={form.assigned_driver_registration_id}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      assigned_driver_registration_id:
                        e.target.value,
                    })
                  }
                >
                  <option value="">-- Select --</option>
                  {drivers.map((d) => (
                    <option
                      key={d.driver_registration_id}
                      value={d.driver_registration_id}
                    >
                      {d.gdc_registration_number}
                    </option>
                  ))}
                </select>
              </div>

              {/* REMARKS */}
              <div>
                <label className="text-sm font-medium">
                  Remarks
                </label>
                <textarea
                  className="w-full border p-2 rounded text-sm"
                  rows="2"
                  value={form.remarks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      remarks: e.target.value,
                    })
                  }
                />
              </div>

              <button
                disabled={loading}
                onClick={handleAssign}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm disabled:opacity-50"
              >
                {loading ? "Assigning..." : "Assign Driver"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
