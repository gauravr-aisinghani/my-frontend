// src/components/DriverDocumentsForm.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import driverDocumentsApi from "../api/driverDocumentsApi";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

const fieldLabels = {
  driverSelfie: "Driver Selfie",
  homePhoto: "Home Photo",
  sarpanchLetter: "Sarpanch Letter",
  bankAccountDetails: "Bank Account Details",
  passbookPhoto: "Passbook Photo",
  aadharPhoto: "Aadhar Photo",
  panPhoto: "Pan Photo",
  licencePhoto: "Licence Photo",
  driverSignature: "Driver Signature",
};

const DriverDocumentsForm = ({ onNext, onBack }) => {
  const driverId = useSelector(
    (state) => state.driverRegistration.registrationId
  );

  const [formData, setFormData] = useState({
    driverSelfie: null,
    homePhoto: null,
    sarpanchLetter: null,
    bankAccountDetails: null,
    passbookPhoto: null,
    aadharPhoto: null,
    panPhoto: null,
    licencePhoto: null,
    driverSignature: null,
  });

  const [errors, setErrors] = useState({});

  const inputClass = (name) =>
    `border rounded px-2 py-1 text-sm w-full ${
      errors[name] ? "border-red-500" : "border-gray-300"
    }`;

  const renderError = (name) =>
    errors[name] ? (
      <p className="text-red-500 text-[11px] mt-0.5">{errors[name]}</p>
    ) : null;

  const handleChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      // file type validation
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Invalid file type. Allowed: jpg, png, pdf",
        }));
        setFormData((prev) => ({ ...prev, [name]: null }));
        return;
      }

      // file size validation
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [name]: `File size exceeds ${MAX_FILE_SIZE_MB}MB`,
        }));
        setFormData((prev) => ({ ...prev, [name]: null }));
        return;
      }

      setErrors((prev) => ({ ...prev, [name]: "" }));
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateField = (name, value) => {
    let msg = "";
    if (!value) msg = "This field is required";
    setErrors((prev) => ({ ...prev, [name]: msg }));
    return !msg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!driverId) {
      alert("Driver Registration ID is missing!");
      return;
    }

    let hasError = false;
    for (const key in formData) {
      if (!validateField(key, formData[key])) hasError = true;
    }
    if (hasError) return;

    const fd = new FormData();
    fd.append("driverRegistrationId", driverId);
    Object.keys(formData).forEach((key) => fd.append(key, formData[key]));

    try {
      await driverDocumentsApi.saveDocuments(fd);
      alert("Driver Documents saved successfully!");
      if (onNext) onNext();
    } catch (err) {
      console.error(err);
      alert("Error saving driver documents.");
    }
  };

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4 text-green-700">
        DRIVER DOCUMENTS UPLOAD
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.keys(formData).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="text-[11px] font-medium mb-1">
                {fieldLabels[key]} *
              </label>
              <input
                type="file"
                name={key}
                onChange={handleChange}
                className={inputClass(key)}
              />
              {renderError(key)}
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
            >
              ← Back
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Save & Next →
          </button>
        </div>
      </form>
    </div>
  );
};

export default DriverDocumentsForm;
