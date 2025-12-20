// src/components/TransporterStep1.jsx
import React, { useState } from "react";
import { useTransporter } from "../context/TransporterContext";

export default function TransporterStep1({ onNext }) {
  const { data, updateStepData, update } = useTransporter();
  const initial = data.step1 || {};
  const [local, setLocal] = useState({
    transportCompanyName: initial.transportCompanyName || "",
    transportGstNumber: initial.transportGstNumber || "",
    address: initial.address || "",
    ownerName: initial.ownerName || "",
    mobileNumber: initial.mobileNumber || "",
    contactManagerName: initial.contactManagerName || "",
    contactManagerMobile: initial.contactManagerMobile || "",
    email: initial.email || "",
    mobileOtp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [mockOtp, setMockOtp] = useState(null);
  const [otpVerified, setOtpVerified] = useState(data.verification?.otpValidated || false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // limit mobile fields to 10 digits
    if (["mobileNumber", "contactManagerMobile"].includes(name)) {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }
    setLocal(prev => ({ ...prev, [name]: value }));
  };

  const sendOtp = () => {
    if (!/^\d{10}$/.test(local.mobileNumber)) {
      alert("Enter a valid 10-digit mobile number to send OTP.");
      return;
    }
    const otp = String(100000 + Math.floor(Math.random() * 900000));
    setMockOtp(otp);
    setOtpSent(true);
    // In mock we show it via alert (in production this is sent by backend/provider).
    alert(`Mock OTP sent: ${otp}`);
  };

  const verifyOtp = () => {
    if (local.mobileOtp === mockOtp) {
      setOtpVerified(true);
      update({ verification: { ...(data.verification || {}), otpValidated: true } });
      alert("OTP verified (mock).");
    } else {
      alert("Invalid OTP (mock).");
    }
  };

  const handleNext = () => {
    // basic validation
    if (!local.transportCompanyName || !local.ownerName || !/^\d{10}$/.test(local.mobileNumber)) {
      alert("Please fill Company Name, Owner Name and valid Mobile Number.");
      return;
    }
    // save to context
    updateStepData("step1", local);
    update({ step: 2 });
    onNext?.();
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Step 1 — Basic Transporter Info</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm">Transport Company Name</label>
          <input name="transportCompanyName" value={local.transportCompanyName} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm">Total Gaadi</label>
          <input name="totalGaadi" value={local.totalGaadi || ""} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm">Transport GST Number</label>
          <input name="transportGstNumber" value={local.transportGstNumber} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm">Make</label>
          <input name="make" value={local.make || ""} onChange={handleChange} className="input" />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm">Address</label>
          <input name="address" value={local.address} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm">Owner Name</label>
          <input name="ownerName" value={local.ownerName} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm">Gaadi Number (example)</label>
          <input name="gaadiNumber" value={local.gaadiNumber || ""} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm">Mobile Number</label>
          <div className="flex gap-2">
            <input name="mobileNumber" value={local.mobileNumber} onChange={handleChange} className="input" />
            <button type="button" onClick={sendOtp} className="btn">Send OTP</button>
          </div>
        </div>

        <div>
          <label className="block text-sm">Contact Manager Name</label>
          <input name="contactManagerName" value={local.contactManagerName} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm">Contact Manager Mobile</label>
          <input name="contactManagerMobile" value={local.contactManagerMobile} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm">Email ID</label>
          <input name="email" value={local.email} onChange={handleChange} className="input" />
        </div>

        <div>
          <label className="block text-sm">Mobile OTP (mock)</label>
          <div className="flex gap-2">
            <input name="mobileOtp" value={local.mobileOtp} onChange={handleChange} className="input" />
            <button type="button" onClick={verifyOtp} className="btn" disabled={!otpSent}>Verify</button>
          </div>
          {otpVerified && <p className="text-sm text-green-600 mt-1">OTP verified ✅</p>}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <div />
        <button onClick={handleNext} className="btn-primary">Next →</button>
      </div>
    </div>
  );
}
