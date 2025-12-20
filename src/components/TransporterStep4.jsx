// src/components/TransporterStep4.jsx
import React, { useState } from "react";
import { useTransporter } from "../context/TransporterContext";


export default function TransporterStep4({ onBack, onComplete }) {
  const { data, update, updateStepData } = useTransporter();
  const [approve, setApprove] = useState(data.verification?.approved || false);
  const [generating, setGenerating] = useState(false);
  const [wtlId, setWtlId] = useState(data.savedRecord?.wtlId || null);

  const handleApproveToggle = (val) => {
    setApprove(val);
    update({ verification: { ...(data.verification || {}), approved: val } });
  };

  const handleFinalSubmit = async () => {
    // Prepare payload by merging step data
    const payload = {
      ...data.step1,
      ...data.step2,
      ...data.step3,
      verification: data.verification,
    };

    // If files exist, build FormData for upload
    const files = data.step3?.files || {};
    let body;
    let useFormData = false;
    const hasFile = Object.values(files).some(Boolean);
    if (hasFile) {
      useFormData = true;
      body = new FormData();
      // append all fields
      Object.entries(payload).forEach(([k, v]) => {
        if (v !== undefined && typeof v !== "object") body.append(k, v);
        else if (v && typeof v === "object") body.append(k, JSON.stringify(v));
      });
      // append files
      Object.entries(files).forEach(([k, f]) => {
        if (f) body.append(k, f);
      });
    } else {
      body = payload;
    }

    setGenerating(true);

    try {
      // Using mock save for now; if you switch to real API, the transporterApi exports real function.
      const res = await saveTransporterRegistration(body);

      if (res?.success) {
        // simulate WTL id
        const id = res.data?.wtlId || `WTL-${Math.floor(10000 + Math.random() * 89999)}`;
        setWtlId(id);
        update({ submitted: true, savedRecord: { ...res.data, wtlId: id } });

        // Optionally send whatsapp message - mock action
        alert(`Transporter saved. Auto WTL ID: ${id}\n(You can send WhatsApp / SMS via backend)`);
        onComplete?.(res.data);
      } else {
        alert("Save failed (mock).");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save (see console).");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Step 4 — Verification & Approval</h3>

      <div className="flex gap-4 items-center">
        <div>
          <button className={`btn ${approve ? "bg-green-600" : ""}`} onClick={() => handleApproveToggle(true)}>Approve</button>
        </div>
        <div>
          <button className={`btn ${!approve ? "bg-red-600" : ""}`} onClick={() => handleApproveToggle(false)}>Reject</button>
        </div>
        <div>
          <p className="text-sm">Current: {approve ? "Approved ✅" : "Not Approved"}</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-600">Review files and details in previous steps before final submit.</p>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={() => { update({ step: 3 }); onBack?.(); }} className="btn">← Back</button>
        <div className="flex gap-3">
          <button onClick={handleFinalSubmit} className="btn-primary" disabled={generating}>
            {generating ? "Saving..." : "Complete & Save"}
          </button>
        </div>
      </div>

      {wtlId && (
        <div className="mt-4 p-3 bg-green-50 border rounded">
          <p><strong>WTL Registration ID:</strong> {wtlId}</p>
          <p className="text-sm text-gray-600 mt-1">You can send confirmation via WhatsApp/SMS from backend using this ID.</p>
        </div>
      )}
    </div>
  );
}
