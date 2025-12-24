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

  const [isFresher, setIsFresher] = useState(false);

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

  /* ---------------- HANDLE CHANGE ---------------- */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData((p) => ({ ...p, [name]: files[0] }));
      return;
    }

    // Owner mobile – digits only, max 10
    if (name === "ownerContactNo") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ---------------- VALIDATION ---------------- */
  const validate = () => {
    if (!driverId) return "Driver Registration ID missing.";

    if (isFresher) return null;

    if (!formData.vehicleMake) return "Vehicle Make is required.";
    if (!formData.vehicleModel) return "Vehicle Model is required.";
    if (!formData.lastTransportName)
      return "Last Transporter Name is required.";
    if (!formData.transportAddress)
      return "Transport Address is required.";
    if (!formData.ownerName) return "Owner Name is required.";

    if (!formData.ownerContactNo)
      return "Owner Mobile Number is required.";
    if (!/^\d{10}$/.test(formData.ownerContactNo))
      return "Owner Mobile must be exactly 10 digits.";

    if (!formData.postOfDriving)
      return "Post of Driving is required.";

    if (!formData.fromDate) return "From Date is required.";

    if (
      formData.toDate &&
      new Date(formData.toDate) < new Date(formData.fromDate)
    )
      return "To Date cannot be before From Date.";

    // Indian vehicle number (simple & safe)
    if (
      formData.gaadiNumber &&
      !/^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4}$/i.test(formData.gaadiNumber)
    )
      return "Invalid vehicle number format.";

    if (
      formData.totalWorkOnVehicle &&
      Number(formData.totalWorkOnVehicle) < 0
    )
      return "Work on vehicle cannot be negative.";

    if (
      formData.totalExperienceYears &&
      Number(formData.totalExperienceYears) < 0
    )
      return "Total experience cannot be negative.";

    return null;
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fresher → skip API
    if (isFresher) {
      dispatch(setStep(5));
      return;
    }

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
      dispatch(setStep(5));
    } catch (err) {
      alert("Error saving last experience.");
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">
        Last Experience Details
      </h2>

      {/* Fresher Option */}
      <label className="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={isFresher}
          onChange={(e) => setIsFresher(e.target.checked)}
        />
        Driver is a Fresher (No Previous Experience)
      </label>

      {!isFresher && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              name="vehicleMake"
              placeholder="Vehicle Make (Tata, Ashok Leyland) *"
              value={formData.vehicleMake}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <input
              name="vehicleModel"
              placeholder="Vehicle Model (407, 1613, Bolero Pickup) *"
              value={formData.vehicleModel}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <input
              name="gaadiNumber"
              placeholder="Vehicle Number (MH12AB1234)"
              value={formData.gaadiNumber}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <input
              name="lastTransportName"
              placeholder="Last Transporter Name *"
              value={formData.lastTransportName}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <input
              name="transportAddress"
              placeholder="Transport Address *"
              value={formData.transportAddress}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <input
              name="ownerName"
              placeholder="Owner Name *"
              value={formData.ownerName}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <input
              name="ownerContactNo"
              placeholder="Owner Mobile (10 digits) *"
              value={formData.ownerContactNo}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <input
              type="number"
              name="totalWorkOnVehicle"
              placeholder="Years Worked on This Vehicle"
              value={formData.totalWorkOnVehicle}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <input
              type="number"
              name="totalExperienceYears"
              placeholder="Total Driving Experience (Years)"
              value={formData.totalExperienceYears}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />

            <select
              name="postOfDriving"
              value={formData.postOfDriving}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            >
              <option value="">Post of Driving *</option>
              <option value="HCV">HCV</option>
              <option value="LCV">LCV</option>
              <option value="CAR">CAR</option>
              <option value="TAXI">TAXI</option>
            </select>

            <label className="text-sm">
              From Date *
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full mt-1"
              />
            </label>

            <label className="text-sm">
              To Date
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                className="border rounded px-3 py-2 w-full mt-1"
              />
            </label>
          </div>

          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Save & Continue →
            </button>
          </div>
        </form>
      )}

      {isFresher && (
        <div className="flex justify-end">
          <button
            onClick={() => dispatch(setStep(5))}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
};

export default LastExperienceForm;
