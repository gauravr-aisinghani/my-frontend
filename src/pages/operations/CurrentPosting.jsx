import React from "react";

const trips = [
  { driver: "Ramesh", transporter: "ABC", route: "Delhi-Jaipur", status: "Running" },
];

export default function CurrentPosting() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Current Posting</h1>

      <table className="w-full bg-white border text-sm">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-2">Driver</th>
            <th className="p-2">Transporter</th>
            <th className="p-2">Route</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((t, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{t.driver}</td>
              <td className="p-2">{t.transporter}</td>
              <td className="p-2">{t.route}</td>
              <td className="p-2 text-green-600">{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
