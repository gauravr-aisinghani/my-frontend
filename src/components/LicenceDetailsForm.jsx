// src/components/LicenceDetailsForm.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStep2,
  setStep,
  selectDriverRegistration,
} from "../store/driverRegistrationSlice";
import { saveLicenceDetails } from "../api/licenceApi";

const LicenceDetailsForm = () => {
  const dispatch = useDispatch();
  const reg = useSelector(selectDriverRegistration);
  const driverId = reg?.registrationId;

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

  /* ---------- COMMON INPUT CLASS (same as previous file) ---------- */
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

    // PAN: uppercase + length limit
    if (name === "panNumber") {
      if (value.length > 10) return;
      if (!/^[A-Z0-9]*$/i.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name === "panNumber" ? value.toUpperCase() : value,
    }));
  };

  /* ---------- FIELD VALIDATION (ON BLUR) ---------- */
  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "employeeCardNo":
        if (value && value.length < 3)
          msg = "Employee Card No must be at least 3 characters";
        break;

      case "panNumber":
        if (value && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value))
          msg = "Invalid PAN format";
        break;

      case "licenceNumber":
        if (!value) msg = "Licence Number is required";
        else if (!/^[A-Z0-9-]{5,20}$/i.test(value))
          msg = "Invalid Licence Number";
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
          msg = "End Date cannot be before Issue Date";
        break;

      case "issuingAuthority":
        if (!value) msg = "Issuing Authority is required";
        break;

      case "anyOffence":
        if (!value) msg = "Please select an option";
        break;

      case "offenceRemark":
        if (formData.anyOffence === "YES" && !value)
          msg = "Offence Remark is required";
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

    if (!driverId) {
      alert("Driver Registration ID missing. Complete Step 1.");
      return;
    }

    const fieldsToValidate = [
      "licenceNumber",
      "licenceGrade",
      "issueDate",
      "validityEndDate",
      "issuingAuthority",
      "anyOffence",
    ];

    let hasError = false;

    fieldsToValidate.forEach((f) => {
      if (!validateField(f, formData[f])) hasError = true;
    });

    if (formData.anyOffence === "YES") {
      if (!validateField("offenceRemark", formData.offenceRemark))
        hasError = true;
    }

    if (hasError) return;

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
    } catch (err) {
      alert("Error saving licence details");
    }
  };

  /* ---------- JSX ---------- */
  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">
        Licence Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <input
              name="employeeCardNo"
              value={formData.employeeCardNo}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("employeeCardNo", e.target.value)
              }
              placeholder="Employee Card No"
              className={inputClass("employeeCardNo")}
            />
            {renderError("employeeCardNo")}
          </div>

          <div>
            <input
              name="panNumber"
              value={formData.panNumber}
              onChange={handleChange}
              onBlur={(e) => validateField("panNumber", e.target.value)}
              placeholder="PAN Number"
              className={inputClass("panNumber")}
            />
            {renderError("panNumber")}
          </div>

          <div>
            <input
              name="licenceNumber"
              value={formData.licenceNumber}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("licenceNumber", e.target.value)
              }
              placeholder="Licence Number *"
              className={inputClass("licenceNumber")}
            />
            {renderError("licenceNumber")}
          </div>

          <div>
            <select
              name="licenceGrade"
              value={formData.licenceGrade}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("licenceGrade", e.target.value)
              }
              className={inputClass("licenceGrade")}
            >
              <option value="">Licence Grade *</option>
              <option value="LMV">LMV</option>
              <option value="HMV">HMV</option>
              <option value="MCWG">MCWG</option>
              <option value="MCWOG">MCWOG</option>
              <option value="TRANS">Transport</option>
              <option value="TRAILER">Trailer</option>
            </select>
            {renderError("licenceGrade")}
          </div>

          <div>
            <label className="text-[11px] font-medium">Issue Date *</label>
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("issueDate", e.target.value)
              }
              className={inputClass("issueDate")}
            />
            {renderError("issueDate")}
          </div>

          <div>
            <label className="text-[11px] font-medium">
              Validity End Date *
            </label>
            <input
              type="date"
              name="validityEndDate"
              value={formData.validityEndDate}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("validityEndDate", e.target.value)
              }
              className={inputClass("validityEndDate")}
            />
            {renderError("validityEndDate")}
          </div>

          <div>
            <input
              name="issuingAuthority"
              value={formData.issuingAuthority}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("issuingAuthority", e.target.value)
              }
              placeholder="Issuing Authority *"
              className={inputClass("issuingAuthority")}
            />
            {renderError("issuingAuthority")}
          </div>

          <div>
            <select
              name="anyOffence"
              value={formData.anyOffence}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("anyOffence", e.target.value)
              }
              className={inputClass("anyOffence")}
            >
              <option value="">Any Offence? *</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
            {renderError("anyOffence")}
          </div>

          {formData.anyOffence === "YES" && (
            <div>
              <input
                name="offenceRemark"
                value={formData.offenceRemark}
                onChange={handleChange}
                onBlur={(e) =>
                  validateField("offenceRemark", e.target.value)
                }
                placeholder="Offence Remark *"
                className={inputClass("offenceRemark")}
              />
              {renderError("offenceRemark")}
            </div>
          )}
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

export default LicenceDetailsForm;
