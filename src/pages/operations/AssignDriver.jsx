import React, { useState } from "react";

const dummyTransporters = [
  { id: 1, name: "ABC Transport", city: "Delhi", vehicle: "Truck" },
  { id: 2, name: "FastMove Logistics", city: "Jaipur", vehicle: "Trailer" },
];

const dummyDrivers = [
  { id: 101, name: "Ramesh Kumar", license: "DL-1234" },
  { id: 102, name: "Suresh Singh", license: "DL-5678" },
];

export default function AssignDriver() {
  const [selectedTransporter, setSelectedTransporter] = useState(null);

  const [form, setForm] = useState({
    driverId: "",
    hireType: "TRIP", // TRIP or MONTHLY
    route: "",
    tripCharges: "",
    tripDate: "",
    monthlySalary: "",
    startDate: "",
    remarks: "",
  });

  const handleAssign = () => {
    if (!selectedTransporter || !form.driverId) {
      alert("Please select transporter & driver");
      return;
    }

    const payload = {
      transporterId: selectedTransporter.id,
      ...form,
    };

    console.log("Assignment Payload:", payload);

    alert("Driver Assigned Successfully!");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Assign Driver to Transporter</h1>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Transporter List */}
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-medium mb-3">Transporters</h2>

          <table className="w-full text-sm border">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">City</th>
                <th className="p-2">Vehicle</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {dummyTransporters.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-2">{t.name}</td>
                  <td className="p-2">{t.city}</td>
                  <td className="p-2">{t.vehicle}</td>
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

        {/* Assign Form */}
        <div className="bg-white border rounded-lg p-4 space-y-3">
          <h2 className="font-medium">Assign Driver</h2>

          {selectedTransporter && (
            <p className="text-sm text-green-700">
              Selected: {selectedTransporter.name}
            </p>
          )}

          {/* Driver Select */}
          <select
            className="w-full border p-2 rounded"
            onChange={(e) =>
              setForm({ ...form, driverId: e.target.value })
            }
          >
            <option value="">Select Driver</option>
            {dummyDrivers.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.license})
              </option>
            ))}
          </select>

          {/* Hire Type */}
          <select
            className="w-full border p-2 rounded"
            value={form.hireType}
            onChange={(e) =>
              setForm({ ...form, hireType: e.target.value })
            }
          >
            <option value="TRIP">Trip Basis</option>
            <option value="MONTHLY">Monthly Basis</option>
          </select>

          {/* Trip आधारित Fields */}
          {form.hireType === "TRIP" && (
            <>
              <input
                className="w-full border p-2 rounded"
                placeholder="Route (Delhi - Jaipur)"
                onChange={(e) =>
                  setForm({ ...form, route: e.target.value })
                }
              />

              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Trip Charges"
                onChange={(e) =>
                  setForm({ ...form, tripCharges: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setForm({ ...form, tripDate: e.target.value })
                }
              />
            </>
          )}

          {/* Monthly आधारित Fields */}
          {form.hireType === "MONTHLY" && (
            <>
              <input
                type="number"
                className="w-full border p-2 rounded"
                placeholder="Monthly Salary"
                onChange={(e) =>
                  setForm({ ...form, monthlySalary: e.target.value })
                }
              />

              <input
                type="date"
                className="w-full border p-2 rounded"
                onChange={(e) =>
                  setForm({ ...form, startDate: e.target.value })
                }
              />
            </>
          )}

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
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            Assign Driver
          </button>
        </div>
      </div>
    </div>
  );
}
