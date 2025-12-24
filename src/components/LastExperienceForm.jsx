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

  const [errors, setErrors] = useState({});

  /* ---------- SAME INPUT DESIGN ---------- */
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
    const { name, value, files } = e.target;

    if (files) {
      setFormData((p) => ({ ...p, [name]: files[0] }));
      return;
    }

    if (name === "ownerContactNo") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }

    setFormData((p) => ({ ...p, [name]: value }));
  };

  /* ---------- FIELD VALIDATION (ON BLUR) ---------- */
  const validateField = (name, value) => {
    let msg = "";

    if (isFresher) {
      setErrors({});
      return true;
    }

    switch (name) {
      case "vehicleMake":
        if (!value) msg = "Vehicle Make is required";
        break;

      case "vehicleModel":
        if (!value) msg = "Vehicle Model is required";
        break;

      case "lastTransportName":
        if (!value) msg = "Last Transporter Name is required";
        break;

      case "transportAddress":
        if (!value) msg = "Transport Address is required";
        break;

      case "ownerName":
        if (!value) msg = "Owner Name is required";
        break;

      case "ownerContactNo":
        if (!value) msg = "Owner Mobile is required";
        else if (!/^\d{10}$/.test(value))
          msg = "Mobile must be exactly 10 digits";
        break;

      case "gaadiNumber":
        if (
          value &&
          !/^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{4}$/i.test(value)
        )
          msg = "Invalid vehicle number";
        break;

      case "postOfDriving":
        if (!value) msg = "Post of Driving is required";
        break;

      case "fromDate":
        if (!value) msg = "From Date is required";
        break;

      case "toDate":
        if (
          value &&
          formData.fromDate &&
          new Date(value) < new Date(formData.fromDate)
        )
          msg = "To Date cannot be before From Date";
        break;

      default:
        break;
    }

    setErrors((p) => ({ ...p, [name]: msg }));
    return !msg;
  };

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFresher) {
      dispatch(setStep(5));
      return;
    }

    const requiredFields = [
      "vehicleMake",
      "vehicleModel",
      "lastTransportName",
      "transportAddress",
      "ownerName",
      "ownerContactNo",
      "postOfDriving",
      "fromDate",
    ];

    let hasError = false;

    requiredFields.forEach((f) => {
      if (!validateField(f, formData[f])) hasError = true;
    });

    if (formData.gaadiNumber) {
      if (!validateField("gaadiNumber", formData.gaadiNumber))
        hasError = true;
    }

    if (formData.toDate) {
      if (!validateField("toDate", formData.toDate)) hasError = true;
    }

    if (hasError) return;

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
    } catch {
      alert("Error saving last experience");
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">
        Last Experience Details
      </h2>

      {/* Fresher Toggle */}
      <div
        onClick={() => setIsFresher(!isFresher)}
        className={`border rounded p-3 mb-4 cursor-pointer text-sm ${
          isFresher ? "border-green-500 bg-green-50" : ""
        }`}
      >
        <input
          type="checkbox"
          checked={isFresher}
          readOnly
          className="mr-2"
        />
        Driver is a Fresher (No Previous Experience)
      </div>

      {!isFresher && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              ["vehicleMake", "Vehicle Make *"],
              ["vehicleModel", "Vehicle Model *"],
              ["gaadiNumber", "Vehicle Number"],
              ["lastTransportName", "Last Transporter Name *"],
              ["transportAddress", "Transport Address *"],
              ["ownerName", "Owner Name *"],
              ["ownerContactNo", "Owner Mobile *"],
            ].map(([name, label]) => (
              <div key={name}>
                <input
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  onBlur={(e) =>
                    validateField(name, e.target.value)
                  }
                  placeholder={label}
                  className={inputClass(name)}
                />
                {renderError(name)}
              </div>
            ))}

            <select
              name="postOfDriving"
              value={formData.postOfDriving}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("postOfDriving", e.target.value)
              }
              className={inputClass("postOfDriving")}
            >
              <option value="">Post of Driving *</option>
              <option value="HCV">HCV</option>
              <option value="LCV">LCV</option>
              <option value="CAR">CAR</option>
              <option value="TAXI">TAXI</option>
            </select>
            {renderError("postOfDriving")}

            <div>
              <label className="text-[11px] font-medium">
                From Date *
              </label>
              <input
                type="date"
                name="fromDate"
                value={formData.fromDate}
                onChange={handleChange}
                onBlur={(e) =>
                  validateField("fromDate", e.target.value)
                }
                className={inputClass("fromDate")}
              />
              {renderError("fromDate")}
            </div>

            <div>
              <label className="text-[11px] font-medium">
                To Date
              </label>
              <input
                type="date"
                name="toDate"
                value={formData.toDate}
                onChange={handleChange}
                onBlur={(e) =>
                  validateField("toDate", e.target.value)
                }
                className={inputClass("toDate")}
              />
              {renderError("toDate")}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm">
              Save & Continue →
            </button>
          </div>
        </form>
      )}

      {isFresher && (
        <div className="flex justify-end">
          <button
            onClick={() => dispatch(setStep(5))}
            className="bg-blue-500 text-white px-4 py-2 rounded text-sm"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
};

export default LastExperienceForm;
