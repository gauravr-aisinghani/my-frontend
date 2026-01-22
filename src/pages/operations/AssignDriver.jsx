import React, { useState } from "react";

/* 🔹 Dummy data (API se replace hoga) */
const dummyTransporters = [
  { id: 1, name: "ABC Transport", city: "Delhi" },
  { id: 2, name: "FastMove Logistics", city: "Jaipur" },
];

const dummyDrivers = [
  { id: 101, name: "Ramesh Kumar", license: "DL-1234" },
  { id: 102, name: "Suresh Singh", license: "DL-5678" },
];

export default function AssignDriver() {
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  const [form, setForm] = useState({
    driverId: "",
    route: "",
    vehicleNumber: "",
    licenceGrade: "",
    monthlySalary: "",
    joiningDate: "",
    durationMonths: "",
    underload: false,
    overload: false,
    remarks: "",
  });

  const handleAssign = () => {
    if (!selectedTransporter || !form.driverId) {
      alert("Please select transporter & driver");
      return;
    }

    const payload = {
      transporterId: selectedTransporter.id,
      hireType: "MONTHLY",
      ...form,
    };

    console.log("ASSIGN PAYLOAD 👉", payload);
    alert("Driver Assigned Successfully");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Assign Driver (Monthly)</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* ================= Transporters ================= */}
        <div className="bg-white border shadow rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Transporter</th>
                <th className="p-3 border">City</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {dummyTransporters.map((t) => (
                <tr key={t.id}>
                  <td className="p-3 border">{t.name}</td>
                  <td className="p-3 border">{t.city}</td>
                  <td className="p-3 border">
                    <button
                      onClick={() => setSelectedTransporter(t)}
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

        {/* ================= Assignment Form ================= */}
        <div className="bg-white border shadow rounded p-4 space-y-3">
          <h3 className="font-semibold text-lg">Assignment Details</h3>

          {selectedTransporter && (
            <p className="text-sm text-green-700">
              Selected: <strong>{selectedTransporter.name}</strong>
            </p>
          )}

          {/* Driver */}
          <div>
            <label className="text-sm font-medium">Select Driver *</label>
            <select
              className="w-full border p-2 rounded text-sm"
              onChange={(e) =>
                setForm({ ...form, driverId: e.target.value })
              }
            >
              <option value="">-- Select --</option>
              {dummyDrivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.license})
                </option>
              ))}
            </select>
          </div>

          {/* Route */}
          <div>
            <label className="text-sm font-medium">Route</label>
            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="Delhi – Jaipur"
              onChange={(e) =>
                setForm({ ...form, route: e.target.value })
              }
            />
          </div>

          {/* Vehicle Number */}
          <div>
            <label className="text-sm font-medium">Vehicle Number</label>
            <input
              className="w-full border p-2 rounded text-sm"
              placeholder="RJ14 AB 1234"
              onChange={(e) =>
                setForm({ ...form, vehicleNumber: e.target.value })
              }
            />
          </div>

          {/* Licence Grade */}
          <div>
            <label className="text-sm font-medium">
              Licence Grade *
            </label>
            <select
              className="w-full border p-2 rounded text-sm"
              onChange={(e) =>
                setForm({ ...form, licenceGrade: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="LMV">LMV</option>
              <option value="HMV">HMV</option>
              <option value="MCWG">MCWG</option>
              <option value="MCWOG">MCWOG</option>
              <option value="TRANS">Transport</option>
              <option value="TRAILER">Trailer</option>
            </select>
          </div>

          {/* Monthly Salary */}
          <div>
            <label className="text-sm font-medium">
              Monthly Salary (₹)
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded text-sm"
              onChange={(e) =>
                setForm({ ...form, monthlySalary: e.target.value })
              }
            />
          </div>

          {/* Joining Date */}
          <div>
            <label className="text-sm font-medium">
              Joining Date
            </label>
            <input
              type="date"
              className="w-full border p-2 rounded text-sm"
              onChange={(e) =>
                setForm({ ...form, joiningDate: e.target.value })
              }
            />
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium">
              Duration (Months)
            </label>
            <input
              type="number"
              className="w-full border p-2 rounded text-sm"
              onChange={(e) =>
                setForm({ ...form, durationMonths: e.target.value })
              }
            />
          </div>

          {/* Underload / Overload */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.underload}
                onChange={(e) =>
                  setForm({ ...form, underload: e.target.checked })
                }
              />
              Underload
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.overload}
                onChange={(e) =>
                  setForm({ ...form, overload: e.target.checked })
                }
              />
              Overload
            </label>
          </div>

          {/* Remarks */}
          <div>
            <label className="text-sm font-medium">Remarks</label>
            <textarea
              className="w-full border p-2 rounded text-sm"
              rows="2"
              onChange={(e) =>
                setForm({ ...form, remarks: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleAssign}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded text-sm"
          >
            Assign Driver
          </button>
        </div>
      </div>
    </div>
  );
}
