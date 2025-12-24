// src/components/SarpanchDetailsForm.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStep } from "../store/driverRegistrationSlice";
import driverSarpanchApi from "../api/driverSarpanchApi";

const SarpanchDetailsForm = ({ onNext, onBack }) => {
  const dispatch = useDispatch();

  const driverId = useSelector(
    (state) => state.driverRegistration.registrationId
  );

  const [formData, setFormData] = useState({
    sarpanchName: "",
    sarpanchMobile: "",
    familyPerson1Name: "",
    familyPerson1Mobile: "",
    familyPerson2Name: "",
    familyPerson2Mobile: "",
    referenceDriverName: "",
    gdcRegistrationNumber: "",
  });

  const [errors, setErrors] = useState({});

  /* ---------- INPUT CLASS ---------- */
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

    // EXACT 10 DIGIT MOBILE
    if (
      ["sarpanchMobile", "familyPerson1Mobile", "familyPerson2Mobile"].includes(
        name
      )
    ) {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    if (
      [
        "sarpanchName",
        "familyPerson1Name",
        "familyPerson2Name",
        "referenceDriverName",
      ].includes(name)
    ) {
      if (value.length > 150) return;
    }

    if (name === "gdcRegistrationNumber" && value.length > 50) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- VALIDATION (ON BLUR) ---------- */
  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "sarpanchName":
        if (!value.trim()) msg = "Sarpanch name is required";
        break;

      case "sarpanchMobile":
        if (!value) msg = "Sarpanch mobile is required";
        else if (!/^\d{10}$/.test(value))
          msg = "Mobile number must be exactly 10 digits";
        break;

      case "familyPerson1Mobile":
      case "familyPerson2Mobile":
        if (value && !/^\d{10}$/.test(value))
          msg = "Mobile number must be exactly 10 digits";
        break;

      case "gdcRegistrationNumber":
        if (formData.referenceDriverName && !value)
          msg = "GDC number is required";
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
      alert("Driver Registration ID missing!");
      return;
    }

    let hasError = false;

    ["sarpanchName", "sarpanchMobile"].forEach((f) => {
      if (!validateField(f, formData[f])) hasError = true;
    });

    if (formData.referenceDriverName) {
      if (
        !validateField(
          "gdcRegistrationNumber",
          formData.gdcRegistrationNumber
        )
      )
        hasError = true;
    }

    if (hasError) return;

    const payload = {
      driver_registration_id: driverId,
      sarpanch_name: formData.sarpanchName,
      sarpanch_mobile: formData.sarpanchMobile,

      family_person1_name: formData.familyPerson1Name || null,
      family_person1_mobile: formData.familyPerson1Mobile || null,

      family_person2_name: formData.familyPerson2Name || null,
      family_person2_mobile: formData.familyPerson2Mobile || null,

      reference_driver_name: formData.referenceDriverName || null,
      gdc_registration_number: formData.referenceDriverName
        ? formData.gdcRegistrationNumber
        : null,
    };

    try {
      await driverSarpanchApi.createForDriver(driverId, payload);

      if (typeof onNext === "function") onNext();
      else dispatch(setStep(4));
    } catch (error) {
      alert("Error saving sarpanch details.");
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">
        Sarpanch & Family Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <input
              name="sarpanchName"
              value={formData.sarpanchName}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("sarpanchName", e.target.value)
              }
              placeholder="Sarpanch Name *"
              className={inputClass("sarpanchName")}
            />
            {renderError("sarpanchName")}
          </div>

          <div>
            <input
              name="sarpanchMobile"
              value={formData.sarpanchMobile}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("sarpanchMobile", e.target.value)
              }
              placeholder="Sarpanch Mobile *"
              className={inputClass("sarpanchMobile")}
            />
            {renderError("sarpanchMobile")}
          </div>

          <input
            name="familyPerson1Name"
            value={formData.familyPerson1Name}
            onChange={handleChange}
            placeholder="Family Person 1 Name"
            className={inputClass()}
          />

          <div>
            <input
              name="familyPerson1Mobile"
              value={formData.familyPerson1Mobile}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("familyPerson1Mobile", e.target.value)
              }
              placeholder="Family Person 1 Mobile"
              className={inputClass("familyPerson1Mobile")}
            />
            {renderError("familyPerson1Mobile")}
          </div>

          <input
            name="familyPerson2Name"
            value={formData.familyPerson2Name}
            onChange={handleChange}
            placeholder="Family Person 2 Name"
            className={inputClass()}
          />

          <div>
            <input
              name="familyPerson2Mobile"
              value={formData.familyPerson2Mobile}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("familyPerson2Mobile", e.target.value)
              }
              placeholder="Family Person 2 Mobile"
              className={inputClass("familyPerson2Mobile")}
            />
            {renderError("familyPerson2Mobile")}
          </div>

          {/* Reference Driver FIRST */}
          <input
            name="referenceDriverName"
            value={formData.referenceDriverName}
            onChange={handleChange}
            placeholder="Reference Driver Name"
            className={inputClass()}
          />

          {formData.referenceDriverName && (
            <div>
              <input
                name="gdcRegistrationNumber"
                value={formData.gdcRegistrationNumber}
                onChange={handleChange}
                onBlur={(e) =>
                  validateField(
                    "gdcRegistrationNumber",
                    e.target.value
                  )
                }
                placeholder="Reference Driver GDC Number *"
                className={inputClass("gdcRegistrationNumber")}
              />
              {renderError("gdcRegistrationNumber")}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-400 text-white px-4 py-2 rounded text-sm"
            >
              ← Back
            </button>
          )}

          <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm">
            Save & Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

export default SarpanchDetailsForm;
