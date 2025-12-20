// src/components/SarpanchDetailsForm.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStep } from "../store/driverRegistrationSlice";
import driverSarpanchApi from "../api/driverSarpanchApi";

const SarpanchDetailsForm = ({ onNext, onBack }) => {
  const dispatch = useDispatch();

  // read registrationId from store
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
    gdcRegistrationNumber: "",
    referenceDriverName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // numeric mobile validation
    if (
      ["sarpanchMobile", "familyPerson1Mobile", "familyPerson2Mobile"].includes(
        name
      )
    ) {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 15) return;
    }

    // text length validation
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

  const validate = () => {
    if (!driverId) return "Driver Registration ID missing!";
    if (!formData.sarpanchName.trim()) return "Sarpanch name required.";
    if (!formData.sarpanchMobile.trim()) return "Sarpanch mobile required.";

    if (!/^\d{10,15}$/.test(formData.sarpanchMobile))
      return "Sarpanch mobile must be 10–15 digits.";

    if (
      formData.familyPerson1Mobile &&
      !/^\d{10,15}$/.test(formData.familyPerson1Mobile)
    )
      return "Family Person 1 mobile must be 10–15 digits.";

    if (
      formData.familyPerson2Mobile &&
      !/^\d{10,15}$/.test(formData.familyPerson2Mobile)
    )
      return "Family Person 2 mobile must be 10–15 digits.";

    return null;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const err = validate();
  if (err) {
    alert(err);
    return;
  }

  // Backend expects SNAKE_CASE fields
  const payload = {
    driver_registration_id: driverId,
    sarpanch_name: formData.sarpanchName,
    sarpanch_mobile: formData.sarpanchMobile,

    family_person1_name: formData.familyPerson1Name || null,
    family_person1_mobile: formData.familyPerson1Mobile || null,

    family_person2_name: formData.familyPerson2Name || null,
    family_person2_mobile: formData.familyPerson2Mobile || null,

    gdc_registration_number: formData.gdcRegistrationNumber || null,
    reference_driver_name: formData.referenceDriverName || null,
  };

  try {
    await driverSarpanchApi.createForDriver(driverId, payload);

    alert("Sarpanch Details Saved Successfully!");

    if (typeof onNext === "function") {
      onNext();
    } else {
      dispatch(setStep(4));
    }
  } catch (error) {
    console.error(error);
    alert("Error saving sarpanch details.");
  }
};


  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Sarpanch & Family Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            name="sarpanchName"
            placeholder="Sarpanch Name *"
            value={formData.sarpanchName}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="sarpanchMobile"
            placeholder="Sarpanch Mobile *"
            value={formData.sarpanchMobile}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="familyPerson1Name"
            placeholder="Family Person 1 Name"
            value={formData.familyPerson1Name}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="familyPerson1Mobile"
            placeholder="Family Person 1 Mobile"
            value={formData.familyPerson1Mobile}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="familyPerson2Name"
            placeholder="Family Person 2 Name"
            value={formData.familyPerson2Name}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="familyPerson2Mobile"
            placeholder="Family Person 2 Mobile"
            value={formData.familyPerson2Mobile}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="gdcRegistrationNumber"
            placeholder="GDC Registration Number"
            value={formData.gdcRegistrationNumber}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="referenceDriverName"
            placeholder="Reference Driver Name"
            value={formData.referenceDriverName}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="flex justify-between mt-6">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md"
            >
              ← Back
            </button>
          )}

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Save & Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

export default SarpanchDetailsForm;
