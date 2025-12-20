// src/components/TransporterStep1.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";

// ✅ IMPORT CORRECT ACTIONS
import {
  updateTransporterStep1,
  setTransporterRegistrationId,
  setTransporterStep,
} from "../store/transporterRegistrationSlice";

import { saveTransporterDetails } from "../api/transporterDetailsApi";

export default function TransporterStep1({ onNext }) {
  const dispatch = useDispatch();

  const [local, setLocal] = useState({
    transportCompanyName: "",
    gstNumber: "",
    address: "",
    ownerName: "",
    ownerMobileNumber: "",
    contactManagerName: "",
    contactManagerMobileNumber: "",
    emailId: "",
    aadharNumber: "",
    panCardNumber: "",
    dlNumber: "",
    mobileOtp: "",
  });

  const [otpSent, setOtpSent] = useState(false);
  const [mockOtp, setMockOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  /* ===================== HANDLE CHANGE ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["ownerMobileNumber", "contactManagerMobileNumber"].includes(name)
    ) {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    if (name === "aadharNumber") {
      if (!/^\d*$/.test(value) || value.length > 12) return;
    }

    if (name === "panCardNumber") {
      setLocal((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
      return;
    }

    setLocal((prev) => ({ ...prev, [name]: value }));
  };

  /* ===================== OTP MOCK ===================== */
  const sendOtp = () => {
    if (!/^\d{10}$/.test(local.ownerMobileNumber)) {
      alert("Enter valid 10-digit mobile number");
      return;
    }

    const otp = String(100000 + Math.floor(Math.random() * 900000));
    setMockOtp(otp);
    setOtpSent(true);
    alert(`Mock OTP sent: ${otp}`);
  };

  const verifyOtp = () => {
    if (local.mobileOtp === mockOtp) {
      setOtpVerified(true);
      alert("OTP verified");
    } else {
      alert("Invalid OTP");
    }
  };

  /* ===================== SUBMIT ===================== */
  const handleNext = async () => {
    const normalizedAadhar = local.aadharNumber.replace(/\s/g, "");
    const normalizedPan = local.panCardNumber.toUpperCase().trim();

    if (!local.transportCompanyName.trim()) {
      alert("Transport company name required");
      return;
    }

    if (!local.ownerName.trim()) {
      alert("Owner name required");
      return;
    }

    if (!/^\d{10}$/.test(local.ownerMobileNumber)) {
      alert("Valid owner mobile number required");
      return;
    }

    if (!/^\d{12}$/.test(normalizedAadhar)) {
      alert("Aadhaar must be exactly 12 digits");
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(normalizedPan)) {
      alert("Invalid PAN format (ABCDE1234F)");
      return;
    }

    if (!local.dlNumber.trim()) {
      alert("Driving Licence number required");
      return;
    }

    try {
      // ✅ snake_case payload
      const payload = {
        transport_company_name: local.transportCompanyName.trim(),
        gst_number: local.gstNumber.trim(),
        address: local.address.trim(),
        owner_name: local.ownerName.trim(),
        owner_mobile_number: local.ownerMobileNumber,
        contact_manager_name: local.contactManagerName.trim(),
        contact_manager_mobile_number:
          local.contactManagerMobileNumber || null,
        email_id: local.emailId.trim(),
        aadhar_number: normalizedAadhar,
        pan_card_number: normalizedPan,
        dl_number: local.dlNumber.trim(),
      };

      const res = await saveTransporterDetails(payload);

      if (!res?.transporter_registration_id) {
        alert("Transporter Registration ID not received");
        return;
      }

      // ✅ CORRECT DISPATCHES
      dispatch(setTransporterRegistrationId(res.transporter_registration_id));
      dispatch(updateTransporterStep1(local));
      dispatch(setTransporterStep(2));

      onNext?.();
    } catch (error) {
      console.error(error);
      alert("Failed to save transporter details");
    }
  };

  /* ===================== UI ===================== */
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Step 1 — Transporter Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="transportCompanyName" placeholder="Transport Company Name"
          value={local.transportCompanyName} onChange={handleChange} className="input" />

        <input name="gstNumber" placeholder="GST Number"
          value={local.gstNumber} onChange={handleChange} className="input" />

        <input name="address" placeholder="Address"
          value={local.address} onChange={handleChange}
          className="input md:col-span-2" />

        <input name="ownerName" placeholder="Owner Name"
          value={local.ownerName} onChange={handleChange} className="input" />

        <input name="ownerMobileNumber" placeholder="Owner Mobile Number"
          value={local.ownerMobileNumber} onChange={handleChange} className="input" />

        <input name="aadharNumber" placeholder="Aadhaar Number"
          value={local.aadharNumber} onChange={handleChange} className="input" />

        <input name="panCardNumber" placeholder="PAN Card Number"
          value={local.panCardNumber} onChange={handleChange} className="input" />

        <input name="dlNumber" placeholder="Driving Licence Number"
          value={local.dlNumber} onChange={handleChange} className="input" />
      </div>

      <div className="mt-6 text-right">
        <button onClick={handleNext} className="btn-primary">
          Next →
        </button>
      </div>
    </div>
  );
}
