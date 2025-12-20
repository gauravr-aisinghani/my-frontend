// src/components/VillageDetailsForm.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStep3Files, setStep, selectDriverRegistration } from "../store/driverRegistrationSlice";

export default function VillageDetailsForm({ onNext, onBack }) {
  const dispatch = useDispatch();
  const reg = useSelector(selectDriverRegistration);
  const initial = reg.step3 || { files: {} };

  const [local, setLocal] = useState({
    sarpanchName: initial.sarpanchName || "",
    sarpanchMobile: initial.sarpanchMobile || "",
    familyPerson1: initial.familyPerson1 || "",
    familyPerson1Mobile: initial.familyPerson1Mobile || "",
    familyPerson2: initial.familyPerson2 || "",
    familyPerson2Mobile: initial.familyPerson2Mobile || "",
    wtlRefDriver: initial.wtlRefDriver || "",
    registrationNumber: initial.registrationNumber || "",
    files: initial.files || {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocal((p) => ({ ...p, [name]: value }));
  };

  const handleFile = (e) => {
    const name = e.target.name;
    const file = e.target.files[0] || null;
    setLocal((p) => ({ ...p, files: { ...p.files, [name]: file } }));
  };

  const next = () => {
    dispatch(updateStep3Files(local.files));
    dispatch(setStep(4));
    onNext?.();
  };

  const back = () => {
    dispatch(setStep(2));
    onBack?.();
  };

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Village / Sarpanch Details & Others
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium mb-1">Sarpanch / Pradhan Name</label>
          <input
            name="sarpanchName"
            value={local.sarpanchName}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mobile Number</label>
          <input
            name="sarpanchMobile"
            value={local.sarpanchMobile}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Name of Family Person</label>
          <input
            name="familyPerson1"
            value={local.familyPerson1}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mobile No</label>
          <input
            name="familyPerson1Mobile"
            value={local.familyPerson1Mobile}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Name of Family Person</label>
          <input
            name="familyPerson2"
            value={local.familyPerson2}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mobile No</label>
          <input
            name="familyPerson2Mobile"
            value={local.familyPerson2Mobile}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">WTL Reference Driver Name</label>
          <input
            name="wtlRefDriver"
            value={local.wtlRefDriver}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Registration Number</label>
          <input
            name="registrationNumber"
            value={local.registrationNumber}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-1">Upload Sarpanch Letter</label>
          <input
            type="file"
            name="sarpanchLetter"
            onChange={handleFile}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button
          onClick={back}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition"
        >
          ← Back
        </button>
        <button
          onClick={next}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
