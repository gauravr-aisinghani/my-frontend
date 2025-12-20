// src/components/TransporterStep3.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {uploadTransporterDocuments} from "../api/transporterDocumentsApi";

export default function TransporterStep3({ onNext, onBack }) {

  // ✅ Fetch transporter_registration_id from Redux (same pattern as step 2)
  const transporterRegistrationId = useSelector(
    (state) => state.transporterRegistration.registrationId
  );

  const [formData, setFormData] = useState({
    aadharOriginal: null,
    panOriginal: null,
    licenceOriginal: null,
    gstCertificate: null,
    liveHomeOfficePhoto: null,
    stampLetterAgreement: null,
    transporterAccountPassbook: null,
    transporterAutoSignature: null,
    transporterSelfieLiveLocation: null,
  });

  /* ================= HANDLE FILE CHANGE ================= */
  const handleChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));
  };

  /* ================= VALIDATION ================= */
  const validate = () => {
    if (!transporterRegistrationId) {
      return "Transporter Registration ID missing.";
    }

    for (const key in formData) {
      if (!formData[key]) {
        return `${key} is required`;
      }
    }

    return null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const fd = new FormData();

    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });

    try {
      await uploadTransporterDocuments(
        transporterRegistrationId,
        fd
      );

      alert("Transporter documents uploaded successfully!");
      onNext?.();
    } catch (err) {
      console.error(err);
      alert("Failed to upload transporter documents.");
    }
  };

  /* ================= UI ================= */
  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        TRANSPORTER DOCUMENTS UPLOAD
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <FileInput label="Aadhar Original Photo" name="aadharOriginal" onChange={handleChange} />
          <FileInput label="PAN Original Photo" name="panOriginal" onChange={handleChange} />
          <FileInput label="Licence Original Photo" name="licenceOriginal" onChange={handleChange} />
          <FileInput label="GST Certificate" name="gstCertificate" onChange={handleChange} />
          <FileInput label="Live Home / Office Photo" name="liveHomeOfficePhoto" onChange={handleChange} />
          <FileInput label="Stamp Letter Agreement" name="stampLetterAgreement" onChange={handleChange} />
          <FileInput label="Account Passbook" name="transporterAccountPassbook" onChange={handleChange} />
          <FileInput label="Auto Signature" name="transporterAutoSignature" onChange={handleChange} />
          <FileInput label="Live Location Selfie" name="transporterSelfieLiveLocation" onChange={handleChange} />

        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            ← Back
          </button>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save & Next →
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================= REUSABLE FILE INPUT ================= */
const FileInput = ({ label, name, onChange }) => (
  <label className="flex flex-col text-sm font-semibold text-gray-700">
    {label} *
    <input
      type="file"
      name={name}
      required
      onChange={onChange}
      className="border rounded px-3 py-2 mt-1"
    />
  </label>
);
