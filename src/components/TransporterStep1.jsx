import React, { useState } from "react";
import { useDispatch } from "react-redux";

import {
  updateTransporterStep1,
  setTransporterRegistrationId,
  setTransporterStep,
} from "../store/transporterRegistrationSlice";

import { saveTransporterDetails } from "../api/transporterDetailsApi";

const TransporterStep1 = ({ onNext }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    transportCompanyName: "",
    gstNumber: "",
    address: "",
    ownerName: "",
    ownerMobileNumber: "",
    contactManagerName: "",
    contactManagerMobileNumber: "",
    emailId: "",
    panCardNumber: "",
    aadharNumber: "",
    dlNumber: "",
  });

  const [errors, setErrors] = useState({});

  /* ---------- INPUT CLASS (SAME AS LICENCE FORM) ---------- */
  const inputClass = (name) =>
    `border rounded px-2 py-1 text-sm w-full ${
      errors[name] ? "border-red-500" : ""
    }`;

  const renderError = (name) =>
    errors[name] ? (
      <p className="text-red-500 text-[11px] mt-0.5">{errors[name]}</p>
    ) : null;

  /* ---------- HANDLE CHANGE ---------- */
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
      if (value.length > 10) return;
      if (!/^[A-Z0-9]*$/i.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "panCardNumber" ? value.toUpperCase() : value,
    }));
  };

  /* ---------- VALIDATION (ON BLUR + SUBMIT) ---------- */
  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "transportCompanyName":
        if (!value) msg = "Transport Company Name is required";
        break;

      case "gstNumber":
        if (value && !/^[0-9A-Z]{15}$/.test(value))
          msg = "Invalid GST Number";
        break;

      case "address":
        if (!value) msg = "Address is required";
        break;

      case "ownerName":
        if (!value) msg = "Owner Name is required";
        break;

      case "ownerMobileNumber":
        if (!/^\d{10}$/.test(value))
          msg = "Valid 10-digit mobile number required";
        break;

      case "contactManagerName":
        if (!value) msg = "Contact Manager Name is required";
        break;

      case "contactManagerMobileNumber":
        if (!/^\d{10}$/.test(value))
          msg = "Valid 10-digit mobile number required";
        break;

      case "emailId":
        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        )
          msg = "Invalid Email ID";
        break;

      case "panCardNumber":
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value))
          msg = "Invalid PAN format";
        break;

      case "aadharNumber":
        if (!/^\d{12}$/.test(value))
          msg = "Aadhaar must be 12 digits";
        break;

      case "dlNumber":
        if (!value) msg = "Driving Licence Number is required";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return !msg;
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = Object.keys(formData);
    let hasError = false;

    fields.forEach((f) => {
      if (!validateField(f, formData[f])) hasError = true;
    });

    if (hasError) return;

    try {
      /* ✅ EXACT DB FIELD NAMES (snake_case) */
      const payload = {
        transport_company_name: formData.transportCompanyName.trim(),
        gst_number: formData.gstNumber.trim() || null,
        address: formData.address.trim(),
        owner_name: formData.ownerName.trim(),
        owner_mobile_number: formData.ownerMobileNumber,
        contact_manager_name: formData.contactManagerName.trim(),
        contact_manager_mobile_number:
          formData.contactManagerMobileNumber,
        email_id: formData.emailId.trim(),
        pan_card_number: formData.panCardNumber,
        aadhar_number: formData.aadharNumber,
        dl_number: formData.dlNumber.trim(),
      };

      const res = await saveTransporterDetails(payload);

      if (!res?.transporter_registration_id) {
        alert("Transporter Registration ID not received");
        return;
      }

      dispatch(
        setTransporterRegistrationId(
          res.transporter_registration_id
        )
      );
      dispatch(updateTransporterStep1(formData));
      dispatch(setTransporterStep(2));

      onNext?.();
    } catch (err) {
      console.error(err);
      alert("Error saving transporter details");
    }
  };

  /* ---------- JSX ---------- */
  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">
        Transporter Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              <input
                name={key}
                value={value}
                onChange={handleChange}
                onBlur={(e) =>
                  validateField(key, e.target.value)
                }
                placeholder={key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (s) => s.toUpperCase())}
                className={inputClass(key)}
              />
              {renderError(key)}
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm">
            Save & Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransporterStep1;
