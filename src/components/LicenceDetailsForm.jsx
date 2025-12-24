import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStep2,
  setStep,
  selectDriverRegistration,
} from "../store/driverRegistrationSlice";
import { saveLicenceDetails } from "../api/licenceApi";

/* =========================
   🔹 CONSTANTS & REGEX
========================= */

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const LICENCE_REGEX = /^[A-Z0-9\-\/]{8,20}$/;
const EMPLOYEE_CARD_REGEX = /^[A-Z0-9]{5,20}$/;

const LICENCE_AUTHORITIES = [
  "RTO",
  "DTO",
  "ARTO",
  "Transport Department",
  "Other",
];

const LICENCE_GRADES = [
  "LMV",
  "HMV",
  "MCWG",
  "MCWOG",
  "TRANS",
  "TRAILER",
];

export default function LicenceDetailsForm() {
  const dispatch = useDispatch();
  const reg = useSelector(selectDriverRegistration);

  const driverId = reg?.registrationId;

  /* =========================
     🔹 STATE
  ========================= */

  const [formData, setFormData] = useState({
    employeeCardNo: "",
    panNumber: "",
    licenceNumber: "",
    licenceGrade: "",
    issueDate: "",
    validityEndDate: "",
    issuingAuthority: "",
    anyOffence: "",
    offenceRemark: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* =========================
     🔹 CHANGE HANDLER
  ========================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "panNumber") {
      const v = value.toUpperCase();
      if (v.length > 10) return;
      if (!/^[A-Z0-9]*$/.test(v)) return;
      setFormData((p) => ({ ...p, panNumber: v }));
      return;
    }

    if (name === "employeeCardNo") {
      if (value.length > 20) return;
      if (!/^[A-Z0-9]*$/i.test(value)) return;
    }

    if (name === "licenceNumber") {
      if (value.length > 20) return;
      setFormData((p) => ({ ...p, licenceNumber: value.toUpperCase() }));
      return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* =========================
     🔹 FIELD VALIDATION
  ========================= */

  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "employeeCardNo":
        if (value && !EMPLOYEE_CARD_REGEX.test(value))
          msg = "Employee Card No must be 5–20 alphanumeric characters";
        break;

      case "panNumber":
        if (value && !PAN_REGEX.test(value))
          msg = "Invalid PAN format (ABCDE1234F)";
        break;

      case "licenceNumber":
        if (!value) msg = "Licence Number is required";
        else if (!LICENCE_REGEX.test(value))
          msg = "Licence Number must be 8–20 characters";
        break;

      case "licenceGrade":
        if (!value) msg = "Licence Grade is required";
        break;

      case "issueDate":
        if (!value) msg = "Issue Date is required";
        break;

      case "validityEndDate":
        if (!value) msg = "Validity End Date is required";
        else if (
          formData.issueDate &&
          new Date(value) < new Date(formData.issueDate)
        )
          msg = "Validity End Date cannot be before Issue Date";
        break;

      case "issuingAuthority":
        if (!value) msg = "Issuing Authority is required";
        break;

      case "anyOffence":
        if (!value) msg = "Please select offence status";
        break;

      case "offenceRemark":
        if (formData.anyOffence === "YES" && !value.trim())
          msg = "Offence remark is required";
        break;

      default:
        break;
    }

    setErrors((p) => ({ ...p, [name]: msg }));
  };

  const validateAll = () => {
    const fields = [
      "employeeCardNo",
      "panNumber",
      "licenceNumber",
      "licenceGrade",
      "issueDate",
      "validityEndDate",
      "issuingAuthority",
      "anyOffence",
      "offenceRemark",
    ];

    fields.forEach((f) => validateField(f, formData[f]));
    return Object.values(errors).some((e) => e);
  };

  /* =========================
     🔹 SUBMIT
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!driverId) {
      alert("Driver Registration ID missing. Complete Step 1.");
      return;
    }

    if (validateAll()) {
      alert("Please fix validation errors");
      return;
    }

    setLoading(true);

    try {
      dispatch(updateStep2(formData));

      const payload = {
        employee_card_no: formData.employeeCardNo || null,
        pan_number: formData.panNumber || null,
        licence_number: formData.licenceNumber,
        licence_grade: formData.licenceGrade,
        issue_date: formData.issueDate,
        validity_end_date: formData.validityEndDate,
        issuing_authority: formData.issuingAuthority,
        any_offence: formData.anyOffence,
        offence_remark:
          formData.anyOffence === "YES" ? formData.offenceRemark : null,
      };

      await saveLicenceDetails(driverId, payload);

      dispatch(setStep(3));
      alert("Licence Details Saved Successfully!");
    } catch (err) {
      console.error("Licence Save Error:", err);
      alert("Failed to save licence details");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     🔹 JSX
  ========================= */

  return (
    <div className="max-w-6xl mx-auto bg-white p-3 rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-3 border-b pb-1">
        Licence Details
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

          <input
            name="employeeCardNo"
            value={formData.employeeCardNo}
            onChange={handleChange}
            onBlur={(e) => validateField("employeeCardNo", e.target.value)}
            className={`input ${errors.employeeCardNo ? "border-red-500" : ""}`}
            placeholder="Employee Card No"
          />

          <input
            name="panNumber"
            value={formData.panNumber}
            onChange={handleChange}
            onBlur={(e) => validateField("panNumber", e.target.value)}
            className={`input ${errors.panNumber ? "border-red-500" : ""}`}
            placeholder="PAN Number (ABCDE1234F)"
          />

          <input
            name="licenceNumber"
            value={formData.licenceNumber}
            onChange={handleChange}
            onBlur={(e) => validateField("licenceNumber", e.target.value)}
            className={`input ${errors.licenceNumber ? "border-red-500" : ""}`}
            placeholder="Licence Number *"
          />

          <select
            name="licenceGrade"
            value={formData.licenceGrade}
            onChange={handleChange}
            onBlur={(e) => validateField("licenceGrade", e.target.value)}
            className={`input ${errors.licenceGrade ? "border-red-500" : ""}`}
          >
            <option value="">Select Licence Grade *</option>
            {LICENCE_GRADES.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <input
            type="date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            onBlur={(e) => validateField("issueDate", e.target.value)}
            className={`input ${errors.issueDate ? "border-red-500" : ""}`}
          />

          <input
            type="date"
            name="validityEndDate"
            value={formData.validityEndDate}
            onChange={handleChange}
            onBlur={(e) => validateField("validityEndDate", e.target.value)}
            className={`input ${errors.validityEndDate ? "border-red-500" : ""}`}
          />

          <select
            name="issuingAuthority"
            value={formData.issuingAuthority}
            onChange={handleChange}
            onBlur={(e) => validateField("issuingAuthority", e.target.value)}
            className={`input ${errors.issuingAuthority ? "border-red-500" : ""}`}
          >
            <option value="">Issuing Authority *</option>
            {LICENCE_AUTHORITIES.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <select
            name="anyOffence"
            value={formData.anyOffence}
            onChange={handleChange}
            onBlur={(e) => validateField("anyOffence", e.target.value)}
            className={`input ${errors.anyOffence ? "border-red-500" : ""}`}
          >
            <option value="">Any Offence? *</option>
            <option value="YES">YES</option>
            <option value="NO">NO</option>
          </select>

          {formData.anyOffence === "YES" && (
            <input
              name="offenceRemark"
              value={formData.offenceRemark}
              onChange={handleChange}
              onBlur={(e) => validateField("offenceRemark", e.target.value)}
              className={`input ${errors.offenceRemark ? "border-red-500" : ""}`}
              placeholder="Offence Remark *"
            />
          )}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-4 py-1.5 text-xs"
          >
            {loading ? "Saving..." : "Next →"}
          </button>
        </div>
      </form>
    </div>
  );
}
