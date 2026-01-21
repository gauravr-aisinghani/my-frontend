import React from "react";

const payments = [
  { id: 1, name: "ABC Transport", amount: 5000, mode: "UPI", status: "Pending" },
  { id: 2, name: "FastMove", amount: 8000, mode: "Bank", status: "Pending" },
];

export default function PaidByTransporter() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Paid By Transporter</h1>

      <table className="w-full bg-white border text-sm">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-2">Transporter</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Mode</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td className="p-2">₹{p.amount}</td>
              <td className="p-2">{p.mode}</td>
              <td className="p-2 text-yellow-600">{p.status}</td>
              <td className="p-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded text-xs">
                  Verify
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
