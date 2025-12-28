import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTransporterStep } from "../store/transporterRegistrationSlice";
import { saveTransporterVehicle } from "../api/transporterVehicleApi";

const TransporterStep2Vehicle = ({ onNext, onBack }) => {
  const dispatch = useDispatch();

  const transporterRegistrationId = useSelector(
    (state) => state.transporterRegistration.registrationId
  );

  const [formData, setFormData] = useState({
    totalGaadi: "",
    make: "",
    gaadiModelFrom: "",
    gaadiModelTo: "",
    gaadiNumber: "",
    postOfVehicle: "",
    gaadiRouteFrom: "",
    gaadiRouteTo: "",
    otherKnownTransporterInWtl: "",
    mobileNumber: "",
    hirePayment: "",
    paymentTerms: "",
    payment30thDate: "",
  });

  const [errors, setErrors] = useState({});

  const inputClass = (name) =>
    `border rounded px-2 py-1 text-sm w-full ${
      errors[name] ? "border-red-500" : "border-gray-300"
    }`;

  const renderError = (name) =>
    errors[name] ? (
      <p className="text-red-500 text-[11px] mt-1">{errors[name]}</p>
    ) : null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // mobile only digits, max 10
    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "totalGaadi":
        if (!value || Number(value) <= 0)
          msg = "Enter total number of vehicles";
        break;

      case "make":
        if (!value.trim())
          msg = "Vehicle manufacturer is required";
        break;

      case "gaadiModelFrom":
        if (!/^\d{4}$/.test(value))
          msg = "Enter valid year (YYYY)";
        break;

      case "gaadiModelTo":
        if (value && !/^\d{4}$/.test(value))
          msg = "Enter valid year (YYYY)";
        break;

      case "gaadiNumber":
        if (!value.trim())
          msg = "Vehicle registration number required";
        break;

      case "postOfVehicle":
        if (!value)
          msg = "Select vehicle type";
        break;

      case "mobileNumber":
        if (value && !/^\d{10}$/.test(value))
          msg = "Mobile number must be 10 digits";
        break;

      case "hirePayment":
        if (!value)
          msg = "Select hire payment recipient";
        break;

      case "paymentTerms":
        if (!value.trim())
          msg = "Payment terms are required";
        break;

      case "payment30thDate":
        if (!value.trim())
          msg = "Payment commitment required";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
    return !msg;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!transporterRegistrationId) {
      alert("Transporter registration missing");
      return;
    }

    let hasError = false;
    Object.keys(formData).forEach((field) => {
      if (!validateField(field, formData[field])) {
        hasError = true;
      }
    });

    if (hasError) return;

    // ❗ PAYLOAD NOT CHANGED
    const payload = {
      transporter_registration_id: transporterRegistrationId,
      total_gaadi: Number(formData.totalGaadi),
      make: formData.make.trim(),
      gaadi_model_from: Number(formData.gaadiModelFrom),
      gaadi_model_to: formData.gaadiModelTo
        ? Number(formData.gaadiModelTo)
        : null,
      gaadi_number: formData.gaadiNumber.trim(),
      post_of_vehicle: formData.postOfVehicle,
      gaadi_route_from: formData.gaadiRouteFrom || null,
      gaadi_route_to: formData.gaadiRouteTo || null,
      other_known_transporter_in_wtl:
        formData.otherKnownTransporterInWtl || null,
      mobile_number: formData.mobileNumber || null,
      hire_payment: formData.hirePayment,
      payment_terms: formData.paymentTerms.trim(),
      payment_30th_date: formData.payment30thDate.trim(),
    };

    await saveTransporterVehicle(payload);

    dispatch(setTransporterStep(3));
    onNext?.();
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">
        Vehicle & Payment Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label>Total Number of Vehicles</label>
            <input
              type="number"
              name="totalGaadi"
              className={inputClass("totalGaadi")}
              value={formData.totalGaadi}
              onChange={handleChange}
              onBlur={(e) => validateField("totalGaadi", e.target.value)}
            />
            {renderError("totalGaadi")}
          </div>

          <div>
            <label>Vehicle Manufacturer (Make)</label>
            <input
              name="make"
              placeholder="e.g. Tata, Ashok Leyland"
              className={inputClass("make")}
              value={formData.make}
              onChange={handleChange}
              onBlur={(e) => validateField("make", e.target.value)}
            />
            {renderError("make")}
          </div>

          <div>
            <label>Model Year From</label>
            <input
              name="gaadiModelFrom"
              placeholder="YYYY"
              className={inputClass("gaadiModelFrom")}
              value={formData.gaadiModelFrom}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("gaadiModelFrom", e.target.value)
              }
            />
            {renderError("gaadiModelFrom")}
          </div>

          <div>
            <label>Model Year To</label>
            <input
              name="gaadiModelTo"
              placeholder="YYYY"
              className={inputClass("gaadiModelTo")}
              value={formData.gaadiModelTo}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("gaadiModelTo", e.target.value)
              }
            />
            {renderError("gaadiModelTo")}
          </div>

          <div>
            <label>Vehicle Registration Number</label>
            <input
              name="gaadiNumber"
              placeholder="e.g. MH12AB1234"
              className={inputClass("gaadiNumber")}
              value={formData.gaadiNumber}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("gaadiNumber", e.target.value)
              }
            />
            {renderError("gaadiNumber")}
          </div>

          <div>
            <label>Vehicle Type</label>
            <select
              name="postOfVehicle"
              className={inputClass("postOfVehicle")}
              value={formData.postOfVehicle}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("postOfVehicle", e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="HCV">HCV</option>
              <option value="LCV">LCV</option>
              <option value="CAR">Car</option>
              <option value="BIKE">Bike</option>
              <option value="LOADING">Loading</option>
            </select>
            {renderError("postOfVehicle")}
          </div>

          <div>
            <label>Primary Route From</label>
            <input
              name="gaadiRouteFrom"
              className={inputClass("gaadiRouteFrom")}
              value={formData.gaadiRouteFrom}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Primary Route To</label>
            <input
              name="gaadiRouteTo"
              className={inputClass("gaadiRouteTo")}
              value={formData.gaadiRouteTo}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Other Known Transporter (WTL)</label>
            <input
              name="otherKnownTransporterInWtl"
              className={inputClass("otherKnownTransporterInWtl")}
              value={formData.otherKnownTransporterInWtl}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Contact Mobile Number</label>
            <input
              name="mobileNumber"
              placeholder="10 digit number"
              className={inputClass("mobileNumber")}
              value={formData.mobileNumber}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("mobileNumber", e.target.value)
              }
            />
            {renderError("mobileNumber")}
          </div>

          <div>
            <label>Hire Payment Paid To</label>
            <select
              name="hirePayment"
              className={inputClass("hirePayment")}
              value={formData.hirePayment}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("hirePayment", e.target.value)
              }
            >
              <option value="">Select</option>
              <option value="TRANSPORT_ACCOUNT">Transporter</option>
              <option value="DRIVER">Driver</option>
            </select>
            {renderError("hirePayment")}
          </div>

          <div>
            <label>Payment Terms / Cycle</label>
            <input
              name="paymentTerms"
              placeholder="e.g. Monthly / 15 days credit"
              className={inputClass("paymentTerms")}
              value={formData.paymentTerms}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("paymentTerms", e.target.value)
              }
            />
            {renderError("paymentTerms")}
          </div>

          <div>
            <label>Payment Due Commitment</label>
            <input
              name="payment30thDate"
              placeholder="e.g. Payment on or before 30th"
              className={inputClass("payment30thDate")}
              value={formData.payment30thDate}
              onChange={handleChange}
              onBlur={(e) =>
                validateField("payment30thDate", e.target.value)
              }
            />
            {renderError("payment30thDate")}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border rounded"
          >
            ← Back
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Save & Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransporterStep2Vehicle;
