// src/components/TransporterSummary.jsx
import React from "react";
import { useTransporter } from "../context/TransporterContext";

export default function TransporterSummary() {
  const { data } = useTransporter();

  if (!data?.submitted) {
    return (
      <div className="p-6 bg-yellow-50 border rounded">
        <p>Not submitted yet. Please complete registration.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Registration Summary</h3>
      <p><strong>Company:</strong> {data.step1?.transportCompanyName}</p>
      <p><strong>Owner:</strong> {data.step1?.ownerName}</p>
      <p><strong>WTL ID:</strong> {data.savedRecord?.wtlId || data.savedRecord?.wtlId}</p>
      <p className="text-sm text-gray-600 mt-2">Saved at: {data.savedRecord?.createdAt || "—"}</p>
    </div>
  );
}
