import React from "react";

export default function PaymentVerified() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Payment Verified</h1>

      <div className="bg-white p-6 border rounded text-center">
        <p className="text-green-700 font-medium">
          All verified payments are approved for operations.
        </p>
        <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
          Generate WTL Sheet
        </button>
      </div>
    </div>
  );
}
