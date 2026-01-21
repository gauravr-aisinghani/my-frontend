import React from "react";

export default function DriverLedger() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Driver Ledger</h1>

      <table className="w-full bg-white border text-sm">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-2">Date</th>
            <th className="p-2">Description</th>
            <th className="p-2">Credit</th>
            <th className="p-2">Debit</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-2">21-01-26</td>
            <td className="p-2">Trip Payment</td>
            <td className="p-2">₹3000</td>
            <td className="p-2">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
