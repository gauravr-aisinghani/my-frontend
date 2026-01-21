import React from "react";

export default function FinalSettlement() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Final Settlement</h1>

      <div className="bg-white p-6 border rounded">
        <p className="text-gray-700">
          Complete trip payments & close accounts.
        </p>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
          Process Final Payment
        </button>
      </div>
    </div>
  );
}
