// src/components/TransporterStep2.jsx
import React, { useState } from "react";
import { useTransporter } from "../context/TransporterContext";

export default function TransporterStep2({ onNext, onBack }) {
  const { data, updateStepData, update } = useTransporter();
  const initial = data.step2 || {};
  const [local, setLocal] = useState({
    totalGaadi: initial.totalGaadi || "",
    gaadiModelFrom: initial.gaadiModelFrom || "",
    gaadiModelTo: initial.gaadiModelTo || "",
    postType: initial.postType || "",
    routeFrom: initial.routeFrom || "",
    routeTo: initial.routeTo || "",
    knownTransporter: initial.knownTransporter || "",
    knownTransporterMobile: initial.knownTransporterMobile || "",
    hirePayment: initial.hirePayment || "",
    paymentTerms: initial.paymentTerms || "",
    monthlyPayToWtl: initial.monthlyPayToWtl || "",
    paymentDate: initial.paymentDate || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "knownTransporterMobile" && (value.length > 10 || !/^\d*$/.test(value))) return;
    setLocal(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    // basic minimal validation
    // save and go next
    updateStepData("step2", local);
    update({ step: 3 });
    onNext?.();
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Step 2 — Vehicle & Payment Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="totalGaadi" value={local.totalGaadi} onChange={handleChange} placeholder="Total Gaadi" className="input" />
        <input name="gaadiModelFrom" value={local.gaadiModelFrom} onChange={handleChange} placeholder="Gaadi Model From" className="input" />
        <input name="gaadiModelTo" value={local.gaadiModelTo} onChange={handleChange} placeholder="Gaadi Model To" className="input" />
        <input name="postType" value={local.postType} onChange={handleChange} placeholder="Post of HCV/LCV/Loading/CAR/BYKE" className="input" />
        <input name="routeFrom" value={local.routeFrom} onChange={handleChange} placeholder="Route From" className="input" />
        <input name="routeTo" value={local.routeTo} onChange={handleChange} placeholder="Route To" className="input" />
        <input name="knownTransporter" value={local.knownTransporter} onChange={handleChange} placeholder="Other Known Transporter in WTL" className="input" />
        <input name="knownTransporterMobile" value={local.knownTransporterMobile} onChange={handleChange} placeholder="Known Transporter Mobile" className="input" />
        <input name="hirePayment" value={local.hirePayment} onChange={handleChange} placeholder="Hire Payment" className="input" />
        <input name="paymentTerms" value={local.paymentTerms} onChange={handleChange} placeholder="Payment Terms" className="input" />
        <input name="monthlyPayToWtl" value={local.monthlyPayToWtl} onChange={handleChange} placeholder="Monthly Pay to WTL" className="input" />
        <input name="paymentDate" type="date" value={local.paymentDate} onChange={handleChange} className="input" />
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={() => { update({ step: 1 }); onBack?.(); }} className="btn">← Back</button>
        <button onClick={handleNext} className="btn-primary">Next →</button>
      </div>
    </div>
  );
}
