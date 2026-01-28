import React, { useState } from "react";

/* 🔹 Dummy data (API se replace hoga) */
const dummyRequests = [
  {
    request_id: 11,
    transporter_name: "ABC Transport",
    transporter_phone: "9876543210",
    transporter_registration_id: "uuid-111",
    route: "Delhi – Jaipur",
    vehicle_grade: "HMV",
    vehicle_number: "RJ14 AB 1234",
    monthly_salary: 25000,
  },
  {
    request_id: 12,
    transporter_name: "FastMove Logistics",
    transporter_phone: "9123456789",
    transporter_registration_id: "uuid-222",
    route: "Jaipur – Ajmer",
    vehicle_grade: "LMV",
    vehicle_number: "RJ02 CD 8899",
    monthly_salary: 18000,
  },
];

const dummyDrivers = [
  { id: 101, name: "Ramesh Kumar", licence: "HMV" },
  { id: 102, name: "Suresh Singh", licence: "LMV" },
];

export default function AssignDriver() {
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [form, setForm] = useState({
    assigned_driver_registration_id: "",
    joining_date: "",
    duration_months: "",
    underload: false,
    overload: false,
    remarks: "",
  });

  const handleAssign = () => {
    if (!selectedRequest || !form.assigned_driver_registration_id) {
      alert("Please select transporter & driver");
      return;
    }

    /* 🔥 FINAL PAYLOAD (yfs_driver_assignments) */
    const payload = {
      request_id: selectedRequest.request_id,
      assigned_driver_registration_id:
        form.assigned_driver_registration_id,
      transporter_registration_id:
        selectedRequest.transporter_registration_id,
      transporter_phone: selectedRequest.transporter_phone,
      remarks: form.remarks,
    };

    console.log("FINAL ASSIGN PAYLOAD 👉", payload);
    alert("Driver Assigned Successfully");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Assign Driver (Monthly)
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ================= LEFT : DRIVER REQUESTS ================= */}
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
              {dummyRequests.map((r) => (
                <tr key={r.request_id}>
                  <td className="p-3 border">
                    {r.transporter_name}
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

        {/* ================= RIGHT : ASSIGNMENT ================= */}
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
              {/* READ ONLY INFO */}
              <div className="text-sm space-y-1 bg-gray-50 p-3 rounded">
                <p>
                  <strong>Transporter:</strong>{" "}
                  {selectedRequest.transporter_name}
                </p>
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
                  onChange={(e) =>
                    setForm({
                      ...form,
                      assigned_driver_registration_id:
                        e.target.value,
                    })
                  }
                >
                  <option value="">-- Select --</option>
                  {dummyDrivers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.licence})
                    </option>
                  ))}
                </select>
              </div>

              {/* JOINING DATE */}
              <div>
                <label className="text-sm font-medium">
                  Joining Date
                </label>
                <input
                  type="date"
                  className="w-full border p-2 rounded text-sm"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      joining_date: e.target.value,
                    })
                  }
                />
              </div>

              {/* DURATION */}
              <div>
                <label className="text-sm font-medium">
                  Duration (Months)
                </label>
                <input
                  type="number"
                  className="w-full border p-2 rounded text-sm"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      duration_months: e.target.value,
                    })
                  }
                />
              </div>

              {/* FLAGS */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.underload}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        underload: e.target.checked,
                      })
                    }
                  />
                  Underload
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.overload}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        overload: e.target.checked,
                      })
                    }
                  />
                  Overload
                </label>
              </div>

              {/* REMARKS */}
              <div>
                <label className="text-sm font-medium">
                  Remarks
                </label>
                <textarea
                  className="w-full border p-2 rounded text-sm"
                  rows="2"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      remarks: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={handleAssign}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm"
              >
                Assign Driver
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
