// src/components/TransporterStep3.jsx
import React, { useState } from "react";
import { useTransporter } from "../context/TransporterContext";

export default function TransporterStep3({ onNext, onBack }) {
  const { data, updateStepData, update } = useTransporter();
  const initial = data.step3 || { files: {} };

  const [local, setLocal] = useState({
    gstCertificate: initial.files?.gstCertificate || null,
    panCard: initial.files?.panCard || null,
    dl: initial.files?.dl || null,
    aadhaarId: initial.files?.aadhaarId || null,
    panId: initial.files?.panId || null,
    licencePhoto: initial.files?.licencePhoto || null,
    transporterPhoto: initial.files?.transporterPhoto || null,
    liveHomePhoto: initial.files?.liveHomePhoto || null,
    passbookPhoto: initial.files?.passbookPhoto || null,
    driverSignature: initial.files?.driverSignature || null,
    paymentProof: initial.files?.paymentProof || null,
  });

  const handleFile = (e) => {
    const key = e.target.name;
    const file = e.target.files[0] || null;
    setLocal(prev => ({ ...prev, [key]: file }));
  };

  const handleNext = () => {
    // Save files to context (we'll send FormData at final submit)
    updateStepData("step3", { files: local });
    update({ step: 4 });
    onNext?.();
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Step 3 — Upload Documents & Payment Proof</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          GST Certificate / RC
          <input type="file" name="gstCertificate" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          PAN Card (image/pdf)
          <input type="file" name="panCard" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          DL
          <input type="file" name="dl" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          Aadhaar ID (original photo)
          <input type="file" name="aadhaarId" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          PAN ID (original photo)
          <input type="file" name="panId" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          Licence Photo
          <input type="file" name="licencePhoto" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          Transporter Selfie (live)
          <input type="file" name="transporterPhoto" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          Live Home / Office Photo
          <input type="file" name="liveHomePhoto" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          Passbook Photo (Account Details)
          <input type="file" name="passbookPhoto" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          Driver Auto Signature
          <input type="file" name="driverSignature" onChange={handleFile} className="mt-1" />
        </label>

        <label>
          Payment UPI Proof (₹1875)
          <input type="file" name="paymentProof" onChange={handleFile} className="mt-1" />
        </label>
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={() => { update({ step: 2 }); onBack?.(); }} className="btn">← Back</button>
        <button onClick={handleNext} className="btn-primary">Next →</button>
      </div>
    </div>
  );
}
