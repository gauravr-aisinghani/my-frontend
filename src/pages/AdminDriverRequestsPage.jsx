import React, { useState } from "react";
import { CheckCircle, Users, Bell } from "lucide-react";

/* TEMP DATA (API se replace hoga later) */
const dummyRequests = [
  {
    id: 1,
    transporterName: "ABC Transport",
    route: "Delhi → Jaipur",
    vehicle: "RJ14 AB 1234",
    salary: 15000,
    status: "PENDING",
  },
];

const dummyDrivers = [
  { id: 101, name: "Ramesh Kumar", licence: "HMV", city: "Delhi" },
  { id: 102, name: "Suresh Singh", licence: "HMV", city: "Jaipur" },
];

export default function AdminDriverRequestsPage() {
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Driver Requests
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* ================= LEFT: REQUESTS ================= */}
        <div className="col-span-1 bg-white rounded-xl shadow">
          <h2 className="p-4 border-b font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-600" />
            New Requests
          </h2>

          {dummyRequests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedRequest(req)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedRequest?.id === req.id
                  ? "bg-green-50"
                  : ""
              }`}
            >
              <p className="font-medium">
                {req.transporterName}
              </p>
              <p className="text-sm text-gray-500">
                {req.route}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Salary ₹{req.salary}
              </p>
            </div>
          ))}
        </div>

        {/* ================= RIGHT: DETAILS ================= */}
        <div className="col-span-2 bg-white rounded-xl shadow p-6">
          {!selectedRequest ? (
            <p className="text-gray-500 text-center">
              Select a request to view details
            </p>
          ) : (
            <>
              <h2 className="text-lg font-semibold mb-4">
                Request Details
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <Info label="Transporter" value={selectedRequest.transporterName} />
                <Info label="Route" value={selectedRequest.route} />
                <Info label="Vehicle" value={selectedRequest.vehicle} />
                <Info label="Monthly Salary" value={`₹${selectedRequest.salary}`} />
              </div>

              {/* ============ AVAILABLE DRIVERS ============ */}
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Available Drivers
              </h3>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Driver</th>
                      <th className="p-3">Licence</th>
                      <th className="p-3">City</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dummyDrivers.map((d) => (
                      <tr key={d.id} className="border-t">
                        <td className="p-3">{d.name}</td>
                        <td className="p-3 text-center">{d.licence}</td>
                        <td className="p-3 text-center">{d.city}</td>
                        <td className="p-3 text-center">
                          <button className="px-3 py-1 bg-green-600 text-white rounded text-xs">
                            Select
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ============ ACTIONS ============ */}
              <div className="flex gap-4 mt-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg">
                  <CheckCircle className="w-4 h-4" />
                  Notify Transporter (Advance)
                </button>

                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  Notify Driver
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
