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

  // ⭐ FIX — Driver ID now comes from root state, not step1
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "panNumber") {
      if (value.length > 10) return;
      const regex = /^[A-Z0-9]*$/;
      if (!regex.test(value.toUpperCase())) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!driverId) return "Driver Registration ID missing. Complete Step 1.";

    if (!formData.licenceNumber.trim())
      return "Licence Number is required.";

    if (!/^[A-Z0-9-]{5,20}$/i.test(formData.licenceNumber))
      return "Invalid Licence Number format.";

    if (!formData.licenceGrade)
      return "Licence Grade is required.";

    if (!formData.issueDate)
      return "Issue Date is required.";

    if (!formData.validityEndDate)
      return "Validity End Date is required.";

    if (new Date(formData.validityEndDate) < new Date(formData.issueDate))
      return "Validity End Date cannot be before Issue Date.";

    if (formData.anyOffence === "YES" && !formData.offenceRemark.trim())
      return "Please enter Offence Remark.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    try {
      dispatch(updateStep2(formData));

      const payload = {
        employee_card_no: formData.employeeCardNo,
        pan_number: formData.panNumber.toUpperCase(),
        licence_number: formData.licenceNumber,
        licence_grade: formData.licenceGrade,
        issue_date: formData.issueDate,
        validity_end_date: formData.validityEndDate,
        issuing_authority: formData.issuingAuthority,
        any_offence: formData.anyOffence,
        offence_remark: formData.offenceRemark,
      };

      const response = await saveLicenceDetails(driverId, payload);

      console.log("Saved Licence:", response.data);
      alert("Licence Details Saved Successfully!");
      dispatch(setStep(3));
    } catch (err) {
      console.error("Licence Save Error:", err);
      alert("Error saving licence details.");
    }
  };

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        LICENCE DETAILS
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <input
            name="employeeCardNo"
            placeholder="Employee Card No."
            value={formData.employeeCardNo}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="panNumber"
            placeholder="PAN Number (ABCDE1234F)"
            value={formData.panNumber}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="licenceNumber"
            placeholder="Licence Number *"
            value={formData.licenceNumber}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />

          <select
            name="licenceGrade"
            value={formData.licenceGrade}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="">Select Licence Grade *</option>
            <option value="LMV">LMV</option>
            <option value="HMV">HMV</option>
            <option value="MCWG">MCWG</option>
            <option value="MCWOG">MCWOG</option>
            <option value="TRANS">Transport</option>
            <option value="TRAILER">Trailer</option>
          </select>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Licence Issue Date *
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full mt-1"
              required
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Licence Validity End Date *
            <input
              type="date"
              name="validityEndDate"
              value={formData.validityEndDate}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full mt-1"
              required
            />
          </label>

          <input
            name="issuingAuthority"
            placeholder="Issuing Authority"
            value={formData.issuingAuthority}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <select
            name="anyOffence"
            value={formData.anyOffence}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Any Offence?</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>

          {formData.anyOffence === "YES" && (
            <input
              name="offenceRemark"
              placeholder="Offence Remark (Required)"
              value={formData.offenceRemark}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full"
              required
            />
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
          >
            Save & Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

export default LicenceDetailsForm;
