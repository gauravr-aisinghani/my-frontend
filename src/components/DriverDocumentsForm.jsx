// src/components/DriverDocumentsForm.jsx
import React, { useState } from "react";
import { useSelector } from "react-redux";
import driverDocumentsApi from "../api/driverDocumentsApi";

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
    paymentProofUpi: null,
    driverSignature: null,
  });

  const handleChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files[0],
    });
  };

  const validate = () => {
    if (!driverId) return "Driver Registration ID is missing.";

    for (const key in formData) {
      if (!formData[key]) return `${key} is required`;
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const fd = new FormData();
    fd.append("driverRegistrationId", driverId);

    Object.keys(formData).forEach((key) => {
      fd.append(key, formData[key]);
    });

    try {
      await driverDocumentsApi.saveDocuments(fd);
      alert("Driver Documents saved successfully!");
      onNext(1);
    } catch (err) {
      console.error(err);
      alert("Error saving driver documents.");
    }
  };

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        DRIVER DOCUMENTS UPLOAD
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Driver Selfie *
            <input
              type="file"
              name="driverSelfie"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Home Photo *
            <input
              type="file"
              name="homePhoto"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Sarpanch Letter *
            <input
              type="file"
              name="sarpanchLetter"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Bank Account Details *
            <input
              type="file"
              name="bankAccountDetails"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Passbook Photo *
            <input
              type="file"
              name="passbookPhoto"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Aadhar Photo *
            <input
              type="file"
              name="aadharPhoto"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Pan Photo *
            <input
              type="file"
              name="panPhoto"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Licence Photo *
            <input
              type="file"
              name="licencePhoto"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Payment Proof (UPI) *
            <input
              type="file"
              name="paymentProofUpi"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Driver Signature *
            <input
              type="file"
              name="driverSignature"
              required
              onChange={handleChange}
              className="border rounded px-3 py-2 mt-1"
            />
          </label>
        </div>

        <div className="flex justify-between mt-6">
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
};

export default DriverDocumentsForm;
