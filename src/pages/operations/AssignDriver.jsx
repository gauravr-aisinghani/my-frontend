import React, { useState } from "react";

/* 🔹 Dummy Data (baad me API se replace karega) */
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

    console.log("FINAL ASSIGNMENT PAYLOAD 👉", payload);
    alert("Driver Assigned Successfully (Monthly)");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-6">
        Assign Driver (Monthly Basis)
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 🔹 Transporter List */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-medium mb-3">Registered Transporters</h2>

          <table className="w-full text-sm border">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">City</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {dummyTransporters.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.name}</td>
                  <td className="p-2">{t.city}</td>
                  <td className="p-2">
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

        {/* 🔹 Assignment Form */}
        <div className="bg-white border rounded-lg p-4 space-y-3">
          <h2 className="font-medium">Driver Assignment Details</h2>

          {selectedTransporter && (
            <p className="text-sm text-green-700">
              Selected Transporter:{" "}
              <strong>{selectedTransporter.name}</strong>
            </p>
          )}

          {/* Driver */}
          <select
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, driverId: e.target.value })
            }
          >
            <option value="">Select Available Driver *</option>
            {dummyDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.license})
              </option>
            ))}
          </select>

          {/* Route */}
          <input
            className="w-full border p-2 rounded"
            placeholder="Route (e.g. Delhi – Jaipur)"
            onChange={(e) =>
              setForm({ ...form, route: e.target.value })
            }
          />

          {/* Vehicle Number */}
          <input
            className="w-full border p-2 rounded"
            placeholder="Vehicle Number"
            onChange={(e) =>
              setForm({ ...form, vehicleNumber: e.target.value })
            }
          />

          {/* Licence Grade */}
          <select
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, licenceGrade: e.target.value })
            }
          >
            <option value="">Licence Grade *</option>
            <option value="LMV">LMV</option>
            <option value="HMV">HMV</option>
            <option value="MCWG">MCWG</option>
            <option value="MCWOG">MCWOG</option>
            <option value="TRANS">Transport</option>
            <option value="TRAILER">Trailer</option>
          </select>

          {/* Monthly Salary */}
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Monthly Salary (₹)"
            onChange={(e) =>
              setForm({ ...form, monthlySalary: e.target.value })
            }
          />

          {/* Joining Date */}
          <input
            type="date"
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, joiningDate: e.target.value })
            }
          />

          {/* Duration */}
          <input
            type="number"
            className="w-full border p-2 rounded"
            placeholder="Duration (Months)"
            onChange={(e) =>
              setForm({ ...form, durationMonths: e.target.value })
            }
          />

          {/* Remarks */}
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Remarks"
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
          />

          <button
            onClick={handleAssign}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
          >
            Assign Driver (Monthly)
          </button>
        </div>
      </div>
    </div>
  );
}
