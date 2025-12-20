// src/components/TransporterStep1.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateStep1,
  setRegistrationId,
  setStep,
} from "../store/driverRegistrationSlice";
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
  const [mockOtp, setMockOtp] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // mobile number validation
    if (
      ["ownerMobileNumber", "contactManagerMobileNumber"].includes(name)
    ) {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    // Aadhaar validation
    if (name === "aadharNumber") {
      if (!/^\d*$/.test(value) || value.length > 12) return;
    }

    // PAN validation (uppercase only)
    if (name === "panCardNumber") {
      setLocal((prev) => ({
        ...prev,
        [name]: value.toUpperCase(),
      }));
      return;
    }

    setLocal((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleNext = async () => {
    if (
      !local.transportCompanyName ||
      !local.ownerName ||
      !/^\d{10}$/.test(local.ownerMobileNumber) ||
      !/^\d{12}$/.test(local.aadharNumber) ||
      !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(local.panCardNumber)
    ) {
      alert("Please fill all required fields correctly");
      return;
    }

    try {
      // ✅ BACKEND PAYLOAD (snake_case)
      const payload = {
        transport_company_name: local.transportCompanyName,
        gst_number: local.gstNumber,
        address: local.address,
        owner_name: local.ownerName,
        owner_mobile_number: local.ownerMobileNumber,
        contact_manager_name: local.contactManagerName,
        contact_manager_mobile_number:
          local.contactManagerMobileNumber,
        email_id: local.emailId,
        aadhar_number: local.aadharNumber,
        pan_card_number: local.panCardNumber,
        dl_number: local.dlNumber,
      };

      const res = await saveTransporterDetails(payload);

      // 🔑 SAVE registration id
      dispatch(setRegistrationId(res.transporter_registration_id));

      dispatch(updateStep1(local));
      dispatch(setStep(2));
      onNext?.();
    } catch (error) {
      console.error(error);
      alert("Failed to save transporter details");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Step 1 — Transporter Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="transportCompanyName"
          placeholder="Transport Company Name"
          value={local.transportCompanyName}
          onChange={handleChange}
          className="input"
        />

        <input
          name="gstNumber"
          placeholder="GST Number"
          value={local.gstNumber}
          onChange={handleChange}
          className="input"
        />

        <input
          name="address"
          placeholder="Address"
          value={local.address}
          onChange={handleChange}
          className="input md:col-span-2"
        />

        <input
          name="ownerName"
          placeholder="Owner Name"
          value={local.ownerName}
          onChange={handleChange}
          className="input"
        />

        <div className="flex gap-2">
          <input
            name="ownerMobileNumber"
            placeholder="Owner Mobile Number"
            value={local.ownerMobileNumber}
            onChange={handleChange}
            className="input"
          />
          <button type="button" onClick={sendOtp} className="btn">
            Send OTP
          </button>
        </div>

        <input
          name="aadharNumber"
          placeholder="Aadhaar Number (12 digits)"
          value={local.aadharNumber}
          onChange={handleChange}
          className="input"
        />

        <input
          name="panCardNumber"
          placeholder="PAN Card Number"
          value={local.panCardNumber}
          onChange={handleChange}
          className="input"
        />

        <input
          name="dlNumber"
          placeholder="Driving Licence Number"
          value={local.dlNumber}
          onChange={handleChange}
          className="input"
        />

        <input
          name="contactManagerName"
          placeholder="Contact Manager Name"
          value={local.contactManagerName}
          onChange={handleChange}
          className="input"
        />

        <input
          name="contactManagerMobileNumber"
          placeholder="Contact Manager Mobile"
          value={local.contactManagerMobileNumber}
          onChange={handleChange}
          className="input"
        />

        <input
          name="emailId"
          placeholder="Email ID"
          value={local.emailId}
          onChange={handleChange}
          className="input"
        />

        <div className="flex gap-2">
          <input
            name="mobileOtp"
            placeholder="OTP"
            value={local.mobileOtp}
            onChange={handleChange}
            className="input"
          />
          <button
            type="button"
            onClick={verifyOtp}
            disabled={!otpSent}
            className="btn"
          >
            Verify
          </button>
        </div>
      </div>

      {otpVerified && (
        <p className="text-green-600 mt-2">OTP Verified ✅</p>
      )}

      <div className="mt-6 text-right">
        <button onClick={handleNext} className="btn-primary">
          Next →
        </button>
      </div>
    </div>
  );
}
