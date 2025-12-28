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

  /* ---------- INPUT CLASS (SAME STANDARD) ---------- */
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

    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------- VALIDATION ---------- */
  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "totalGaadi":
        if (!value || Number(value) <= 0)
          msg = "Total Gaadi must be greater than 0";
        break;

      case "make":
        if (!value) msg = "Make is required";
        break;

      case "gaadiModelFrom":
        if (!/^\d{4}$/.test(value))
          msg = "Model From must be 4-digit year";
        break;

      case "gaadiModelTo":
        if (value && !/^\d{4}$/.test(value))
          msg = "Model To must be 4-digit year";
        else if (
          value &&
          Number(value) < Number(formData.gaadiModelFrom)
        )
          msg = "Model To cannot be before Model From";
        break;

      case "gaadiNumber":
        if (!value) msg = "Gaadi Number is required";
        break;

      case "postOfVehicle":
        if (!value) msg = "Select vehicle type";
        break;

      case "mobileNumber":
        if (value && !/^\d{10}$/.test(value))
          msg = "Mobile number must be 10 digits";
        break;

      case "hirePayment":
        if (!value) msg = "Select Hire Payment option";
        break;

      case "paymentTerms":
        if (!value) msg = "Payment Terms required";
        break;

      case "payment30thDate":
        if (!value) msg = "Payment 30th Date required";
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

    if (!transporterRegistrationId) {
      alert("Transporter registration missing");
      return;
    }

    const fields = Object.keys(formData);
    let hasError = false;

    fields.forEach((f) => {
      if (!validateField(f, formData[f])) hasError = true;
    });

    if (hasError) return;

    try {
      /* ✅ EXACT DB FIELD PAYLOAD (snake_case) */
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
    } catch (err) {
      console.error(err);
      alert("Failed to save vehicle details");
    }
  };

  /* ---------- JSX ---------- */
  return (
    <div className="w-full p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold text-center mb-4">
        Vehicle Details
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(formData).map(([key, value]) => (
            <div key={key}>
              {key === "postOfVehicle" ? (
                <select
                  name={key}
                  value={value}
                  onChange={handleChange}
                  onBlur={(e) =>
                    validateField(key, e.target.value)
                  }
                  className={inputClass(key)}
                >
                  <option value="">Vehicle Type *</option>
                  <option value="HCV">HCV</option>
                  <option value="LCV">LCV</option>
                  <option value="LOADING">Loading</option>
                  <option value="CAR">Car</option>
                  <option value="BIKE">Bike</option>
                </select>
              ) : key === "hirePayment" ? (
                <select
                  name={key}
                  value={value}
                  onChange={handleChange}
                  onBlur={(e) =>
                    validateField(key, e.target.value)
                  }
                  className={inputClass(key)}
                >
                  <option value="">Hire Payment *</option>
                  <option value="TRANSPORT_ACCOUNT">
                    Transport A/C
                  </option>
                  <option value="DRIVER">Driver</option>
                </select>
              ) : (
                <input
                  name={key}
                  value={value}
                  onChange={handleChange}
                  onBlur={(e) =>
                    validateField(key, e.target.value)
                  }
                  placeholder={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (s) => s.toUpperCase())}
                  className={inputClass(key)}
                />
              )}
              {renderError(key)}
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded text-sm border"
          >
            ← Back
          </button>

          <button className="bg-blue-500 text-white px-4 py-2 rounded text-sm">
            Save & Continue →
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransporterStep2Vehicle;
