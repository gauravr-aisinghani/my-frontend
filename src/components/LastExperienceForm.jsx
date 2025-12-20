// src/components/LastExperienceForm.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setStep } from "../store/driverRegistrationSlice";
import lastExperienceApi from "../api/lastExperienceApi";

const LastExperienceForm = () => {
  const dispatch = useDispatch();

  const driverId = useSelector(
    (state) => state.driverRegistration.registrationId
  );

  const [formData, setFormData] = useState({
    vehicleMake: "",
    vehicleModel: "",
    lastTransportName: "",
    ownerName: "",
    gaadiNumber: "",
    transportAddress: "",
    ownerContactNo: "",
    totalWorkOnVehicle: "",
    totalExperienceYears: "",
    leavingReason: "",
    postOfDriving: "",
    fromDate: "",
    toDate: "",
    experienceDocument: null,
  });

  /** HANDLE CHANGE */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** VALIDATION */
  const validate = () => {
    if (!driverId) return "Driver Registration ID missing.";
    if (!formData.vehicleMake) return "Vehicle Make is required.";
    if (!formData.vehicleModel) return "Vehicle Model is required.";
    if (!formData.postOfDriving) return "Post of Driving is required.";
    if (!formData.fromDate) return "From Date is required.";
    return null;
  };

  /** SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    const fd = new FormData();
    fd.append("driver_registration_id", driverId);
    fd.append("vehicle_make", formData.vehicleMake);
    fd.append("vehicle_model", formData.vehicleModel);
    fd.append("last_transport_name", formData.lastTransportName);
    fd.append("owner_name", formData.ownerName);
    fd.append("gaadi_number", formData.gaadiNumber);
    fd.append("transport_address", formData.transportAddress);
    fd.append("owner_contact_no", formData.ownerContactNo);

    fd.append(
      "total_work_on_vehicle",
      formData.totalWorkOnVehicle || ""
    );

    fd.append(
      "total_experience_years",
      formData.totalExperienceYears || ""
    );

    fd.append("leaving_reason", formData.leavingReason);
    fd.append("post_of_driving", formData.postOfDriving);
    fd.append("from_date", formData.fromDate);
    fd.append("to_date", formData.toDate);

    if (formData.experienceDocument) {
      fd.append("experience_document", formData.experienceDocument);
    }

    try {
      await lastExperienceApi.saveLastExperience(driverId, fd);
      alert("Last Experience Details Saved!");

      // 🔥 FIXED: move to step 5 (Driver Documents)
      dispatch(setStep(5));
    } catch (err) {
      console.error(err);
      alert("Error saving last experience.");
    }
  };

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
        LAST EXPERIENCE DETAILS
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* All Inputs Same */}
          <input
            name="vehicleMake"
            placeholder="Vehicle Make *"
            value={formData.vehicleMake}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />
          
          <input
            name="vehicleModel"
            placeholder="Vehicle Model *"
            value={formData.vehicleModel}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          />

          {/* --- (rest unchanged, all good) --- */}
          <input
            name="lastTransportName"
            placeholder="Last Transport Name"
            value={formData.lastTransportName}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="ownerName"
            placeholder="Owner Name"
            value={formData.ownerName}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="gaadiNumber"
            placeholder="Gaadi Number"
            value={formData.gaadiNumber}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="transportAddress"
            placeholder="Transport Address"
            value={formData.transportAddress}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="ownerContactNo"
            placeholder="Owner Contact No."
            value={formData.ownerContactNo}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            type="number"
            name="totalWorkOnVehicle"
            placeholder="Total Work on Vehicle"
            value={formData.totalWorkOnVehicle}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            type="number"
            name="totalExperienceYears"
            placeholder="Total Experience Years"
            value={formData.totalExperienceYears}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            name="leavingReason"
            placeholder="Leaving Reason"
            value={formData.leavingReason}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
          />

          <select
            name="postOfDriving"
            value={formData.postOfDriving}
            onChange={handleChange}
            className="border rounded px-3 py-2 w-full"
            required
          >
            <option value="">Select Post of Driving *</option>
            <option value="HCV">HCV</option>
            <option value="LCV">LCV</option>
            <option value="LOADING">LOADING</option>
            <option value="TAXI">TAXI</option>
            <option value="CAR">CAR</option>
            <option value="BYKE">BYKE</option>
          </select>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            From Date *
            <input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full mt-1"
              required
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            To Date
            <input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full mt-1"
            />
          </label>

          <label className="flex flex-col text-sm font-semibold text-gray-700">
            Experience Document
            <input
              type="file"
              name="experienceDocument"
              onChange={handleChange}
              className="border rounded px-3 py-2 w-full mt-1"
            />
          </label>

        </div>

        <div className="flex justify-end mt-6">
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

export default LastExperienceForm;
