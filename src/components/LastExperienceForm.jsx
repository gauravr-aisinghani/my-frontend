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
  });

  const [errors, setErrors] = useState({});

  /** INPUT CLASSES */
  const inputClass = (name) =>
    `border rounded px-2 py-1 text-sm w-full ${
      errors[name] ? "border-red-500" : ""
    }`;
  const renderError = (name) =>
    errors[name] ? (
      <p className="text-red-500 text-[11px] mt-0.5">{errors[name]}</p>
    ) : null;

  /** HANDLE CHANGE */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["ownerContactNo", "totalWorkOnVehicle", "totalExperienceYears"].includes(
        name
      )
    ) {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /** VALIDATE FIELDS */
  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "vehicleMake":
        if (!value.trim()) msg = "Vehicle Make is required";
        break;
      case "vehicleModel":
        if (!value.trim()) msg = "Vehicle Model is required";
        break;
      case "lastTransportName":
        if (!value.trim()) msg = "Last Transport Name is required";
        break;
      case "ownerName":
        if (!value.trim()) msg = "Owner Name is required";
        break;
      case "gaadiNumber":
        if (!value.trim()) msg = "Gaadi Number is required";
        else if (!/^[A-Z0-9-]{3,15}$/i.test(value))
          msg = "Invalid Gaadi Number";
        break;
      case "transportAddress":
        if (!value.trim()) msg = "Transport Address is required";
        break;
      case "ownerContactNo":
        if (!value.trim()) msg = "Owner Contact No. is required";
        else if (!/^\d{10}$/.test(value))
          msg = "Owner Contact No must be 10 digits";
        break;
      case "totalWorkOnVehicle":
        if (!value.trim()) msg = "Total Work on Vehicle is required";
        else if (Number(value) <= 0) msg = "Must be greater than 0";
        break;
      case "totalExperienceYears":
        if (!value.trim()) msg = "Total Experience Years is required";
        else if (Number(value) < 0) msg = "Cannot be negative";
        break;
      case "postOfDriving":
        if (!value.trim()) msg = "Post of Driving is required";
        break;
      case "fromDate":
        if (!value) msg = "From Date is required";
        else if (new Date(value) > new Date())
          msg = "From Date cannot be in future";
        break;
      case "toDate":
        if (!value) break;
        else if (formData.fromDate && new Date(value) < new Date(formData.fromDate))
          msg = "To Date cannot be before From Date";
        else if (new Date(value) > new Date())
          msg = "To Date cannot be in future";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return !msg;
  };

  /** SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!driverId) {
      alert("Driver Registration ID missing!");
      return;
    }

    if (isFresher) {
      dispatch(setStep(5)); // skip experience step
      return;
    }

    const fieldsToValidate = [
      "vehicleMake",
      "vehicleModel",
      "lastTransportName",
      "ownerName",
      "gaadiNumber",
      "transportAddress",
      "ownerContactNo",
      "totalWorkOnVehicle",
      "totalExperienceYears",
      "postOfDriving",
      "fromDate",
      "toDate",
    ];

    let hasError = false;
    fieldsToValidate.forEach((f) => {
      if (!validateField(f, formData[f])) hasError = true;
    });

    if (hasError) return;

    const fd = new FormData();
    fd.append("driver_registration_id", driverId);
    Object.entries(formData).forEach(([key, val]) => {
      if (val) fd.append(key, val);
    });

    try {
      await lastExperienceApi.saveLastExperience(driverId, fd);
      alert("Last Experience Details Saved!");
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

      {/* Fresher Toggle Card */}
      <div
        onClick={() => setIsFresher(!isFresher)}
        className={`flex items-center p-4 mb-4 rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl ${
          isFresher ? "bg-green-100 border-green-500" : "bg-gray-50 border-gray-300"
        } border`}
      >
        <span className="text-2xl mr-3">{isFresher ? "🎉" : "🛑"}</span>
        <div>
          <p className="font-semibold text-sm">Driver is a Fresher</p>
          <p className="text-[11px] text-gray-600">Click to skip last experience details</p>
        </div>
      </div>

      {!isFresher && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            <div>
              <input
                name="vehicleMake"
                placeholder="Vehicle Make *"
                value={formData.vehicleMake}
                onChange={handleChange}
                onBlur={(e) => validateField("vehicleMake", e.target.value)}
                className={inputClass("vehicleMake")}
              />
              {renderError("vehicleMake")}
            </div>

            <div>
              <input
                name="vehicleModel"
                placeholder="Vehicle Model *"
                value={formData.vehicleModel}
                onChange={handleChange}
                onBlur={(e) => validateField("vehicleModel", e.target.value)}
                className={inputClass("vehicleModel")}
              />
              {renderError("vehicleModel")}
            </div>

            <div>
              <input
                name="lastTransportName"
                placeholder="Last Transport Name *"
                value={formData.lastTransportName}
                onChange={handleChange}
                onBlur={(e) => validateField("lastTransportName", e.target.value)}
                className={inputClass("lastTransportName")}
              />
              {renderError("lastTransportName")}
            </div>

            <div>
              <input
                name="ownerName"
                placeholder="Owner Name *"
                value={formData.ownerName}
                onChange={handleChange}
                onBlur={(e) => validateField("ownerName", e.target.value)}
                className={inputClass("ownerName")}
              />
              {renderError("ownerName")}
            </div>

            <div>
              <input
                name="gaadiNumber"
                placeholder="Gaadi Number *"
                value={formData.gaadiNumber}
                onChange={handleChange}
                onBlur={(e) => validateField("gaadiNumber", e.target.value)}
                className={inputClass("gaadiNumber")}
              />
              {renderError("gaadiNumber")}
            </div>

            <div>
              <input
                name="transportAddress"
                placeholder="Transport Address *"
                value={formData.transportAddress}
                onChange={handleChange}
                onBlur={(e) => validateField("transportAddress", e.target.value)}
                className={inputClass("transportAddress")}
              />
              {renderError("transportAddress")}
            </div>

            <div>
              <input
                name="ownerContactNo"
                placeholder="Owner Contact No. *"
                value={formData.ownerContactNo}
                onChange={handleChange}
                onBlur={(e) => validateField("ownerContactNo", e.target.value)}
                className={inputClass("ownerContactNo")}
              />
              {renderError("ownerContactNo")}
            </div>

            <div>
              <input
                type="number"
                name="totalWorkOnVehicle"
                placeholder="Total Work on Vehicle *"
                value={formData.totalWorkOnVehicle}
                onChange={handleChange}
                onBlur={(e) => validateField("totalWorkOnVehicle", e.target.value)}
                className={inputClass("totalWorkOnVehicle")}
              />
              {renderError("totalWorkOnVehicle")}
            </div>

            <div>
              <input
                type="number"
                name="totalExperienceYears"
                placeholder="Total Experience Years *"
                value={formData.totalExperienceYears}
                onChange={handleChange}
                onBlur={(e) => validateField("totalExperienceYears", e.target.value)}
                className={inputClass("totalExperienceYears")}
              />
              {renderError("totalExperienceYears")}
            </div>

            <div>
              <input
                name="leavingReason"
                placeholder="Leaving Reason"
                value={formData.leavingReason}
                onChange={handleChange}
                className="border rounded px-2 py-1 w-full text-sm"
              />
            </div>

            <div>
              <select
                name="postOfDriving"
                value={formData.postOfDriving}
                onChange={handleChange}
                onBlur={(e) => validateField("postOfDriving", e.target.value)}
                className={inputClass("postOfDriving")}
              >
                <option value="">Select Post of Driving *</option>
                <option value="HCV">HCV</option>
                <option value="LCV">LCV</option>
                <option value="LOADING">LOADING</option>
                <option value="TAXI">TAXI</option>
                <option value="CAR">CAR</option>
                <option value="BYKE">BYKE</option>
              </select>
              {renderError("postOfDriving")}
            </div>

            <div>
              <label className="flex flex-col text-sm font-semibold text-gray-700">
                From Date *
                <input
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  onBlur={(e) => validateField("fromDate", e.target.value)}
                  className={inputClass("fromDate")}
                />
              </label>
              {renderError("fromDate")}
            </div>

            <div>
              <label className="flex flex-col text-sm font-semibold text-gray-700">
                To Date
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  onBlur={(e) => validateField("toDate", e.target.value)}
                  className={inputClass("toDate")}
                />
              </label>
              {renderError("toDate")}
            </div>

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
      )}
    </div>
  );
};

export default LastExperienceForm;
