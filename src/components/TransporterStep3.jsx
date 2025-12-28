import React, { useState } from "react";
import { useSelector } from "react-redux";
import { uploadTransporterDocuments } from "../api/transporterDocumentsApi";

const MAX_FILE_SIZE_MB = 5;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/pdf",
];

const fieldLabels = {
  transporterSelfieLiveLocation: "Live Location Selfie",
  liveHomeOfficePhoto: "Live Home / Office Photo",
  gstCertificate: "GST Certificate",
  transporterAccountPassbook: "Account Passbook",
  aadharOriginal: "Aadhar Original Photo",
  panOriginal: "PAN Original Photo",
  licenceOriginal: "Licence Original Photo",
  stampLetterAgreement: "Stamp Letter Agreement",
  transporterAutoSignature: "Auto Signature",
};

export default function TransporterStep3({ onNext, onBack }) {
  const transporterRegistrationId = useSelector(
    (state) => state.transporterRegistration.registrationId
  );

  const [formData, setFormData] = useState({
    transporterSelfieLiveLocation: null,
    liveHomeOfficePhoto: null,
    gstCertificate: null,
    transporterAccountPassbook: null,
    aadharOriginal: null,
    panOriginal: null,
    licenceOriginal: null,
    stampLetterAgreement: null,
    transporterAutoSignature: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const inputClass = (name) =>
    `border rounded px-2 py-1 text-sm w-full ${
      errors[name] ? "border-red-500" : "border-gray-300"
    }`;

  const renderError = (name) =>
    errors[name] ? (
      <p className="text-red-500 text-[11px] mt-0.5">{errors[name]}</p>
    ) : null;

  /* ================= HANDLE FILE CHANGE ================= */
  const handleChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (!file) {
      setFormData((prev) => ({ ...prev, [name]: null }));
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [name]: "Invalid file type (jpg, png, pdf allowed)",
      }));
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [name]: `File size must be under ${MAX_FILE_SIZE_MB}MB`,
      }));
      return;
    }

    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: file }));
  };

  /* ================= VALIDATION ================= */
  const validateAll = () => {
    if (!transporterRegistrationId) {
      alert("Transporter Registration ID missing");
      return false;
    }

    let hasError = false;
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This document is required";
        hasError = true;
      }
    });

    setErrors(newErrors);
    return !hasError;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!validateAll()) return;

    const fd = new FormData();
    fd.append("transporter_registration_id", transporterRegistrationId);

    fd.append(
      "transporter_selfie_live_location_url",
      formData.transporterSelfieLiveLocation
    );
    fd.append(
      "live_home_office_photo_url",
      formData.liveHomeOfficePhoto
    );
    fd.append("gst_certificate_url", formData.gstCertificate);
    fd.append(
      "transporter_account_passbook_url",
      formData.transporterAccountPassbook
    );
    fd.append(
      "aadhar_original_photo_url",
      formData.aadharOriginal
    );
    fd.append(
      "pan_original_photo_url",
      formData.panOriginal
    );
    fd.append(
      "licence_original_photo_url",
      formData.licenceOriginal
    );
    fd.append(
      "stamp_letter_agreement_url",
      formData.stampLetterAgreement
    );
    fd.append(
      "transporter_auto_signature_url",
      formData.transporterAutoSignature
    );

    try {
      setLoading(true);
      await uploadTransporterDocuments(transporterRegistrationId, fd);
      alert("Transporter documents uploaded successfully");
      onNext?.();
    } catch (err) {
      console.error(err);
      alert("Failed to upload transporter documents");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="w-full p-4 md:p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold text-center mb-4 text-green-700">
        TRANSPORTER DOCUMENTS UPLOAD
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.keys(formData).map((key) => (
          <div key={key}>
            <label className="text-[11px] font-medium mb-1 block">
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

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
          disabled={loading}
        >
          ← Back
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`px-4 py-2 rounded text-sm text-white ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Uploading..." : "Save & Next →"}
        </button>
      </div>
    </div>
  );
}
