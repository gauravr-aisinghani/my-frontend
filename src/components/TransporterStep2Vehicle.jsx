// src/components/TransporterStep2Vehicle.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTransporterStep } from "../store/transporterRegistrationSlice";
import { saveTransporterVehicle } from "../api/transporterVehicleApi";

export default function TransporterStep2Vehicle({ onNext, onBack }) {
  const dispatch = useDispatch();

  // Transporter registration id from Redux store
  const transporterRegistrationId = useSelector(
    (state) => state.transporterRegistration.registrationId
  );

  const [local, setLocal] = useState({
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

  /* ===================== HANDLE CHANGE ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile validation
    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    // Only allow 4-digit year for gaadi_model_from and gaadi_model_to
    if (["gaadiModelFrom", "gaadiModelTo"].includes(name)) {
      if (!/^\d{0,4}$/.test(value)) return;
    }

    setLocal((prev) => ({ ...prev, [name]: value }));
  };

  /* ===================== HANDLE NEXT ===================== */
  const handleNext = async () => {
    const {
      totalGaadi,
      make,
      gaadiNumber,
      postOfVehicle,
      hirePayment,
      gaadiModelFrom,
      gaadiModelTo,
      paymentTerms,
      payment30thDate,
    } = local;

    // ✅ Basic validations
    if (!transporterRegistrationId) {
      alert("Transporter registration missing. Please complete Step 1.");
      return;
    }
    if (!totalGaadi || Number(totalGaadi) <= 0) {
      alert("Total Gaadi must be greater than 0");
      return;
    }
    if (!make.trim()) {
      alert("Make is required");
      return;
    }
    if (!gaadiNumber.trim()) {
      alert("Gaadi number is required");
      return;
    }
    if (!postOfVehicle) {
      alert("Please select Post of Vehicle");
      return;
    }
    if (!hirePayment) {
      alert("Please select Hire Payment");
      return;
    }
    if (!paymentTerms.trim()) {
      alert("Payment Terms is required");
      return;
    }
    if (!payment30thDate.trim()) {
      alert("Payment 30th Date is required");
      return;
    }
    if (!gaadiModelFrom.trim() || gaadiModelFrom.trim().length !== 4) {
      alert("Gaadi Model From must be a 4-digit year (YYYY)");
      return;
    }
    if (gaadiModelTo.trim() && gaadiModelTo.trim().length !== 4) {
      alert("Gaadi Model To must be a 4-digit year (YYYY)");
      return;
    }

    try {
      const payload = {
        transporter_registration_id: transporterRegistrationId,
        total_gaadi: Number(totalGaadi),
        make: make.trim(),
        gaadi_model_from: gaadiModelFrom.trim(), // YEAR, NOT NULL
        gaadi_model_to: gaadiModelTo.trim() || null, // YEAR, nullable
        gaadi_number: gaadiNumber.trim(),
        post_of_vehicle: postOfVehicle,
        gaadi_route_from: local.gaadiRouteFrom?.trim() || null,
        gaadi_route_to: local.gaadiRouteTo?.trim() || null,
        other_known_transporter_in_wtl:
          local.otherKnownTransporterInWtl?.trim() || null,
        mobile_number: local.mobileNumber?.trim() || null,
        hire_payment: hirePayment,
        payment_terms: paymentTerms.trim(),       // NOT NULL
        payment_30th_date: payment30thDate.trim(), // NOT NULL
      };

      console.log("Payload sent to API:", payload);

      await saveTransporterVehicle(payload);

      // Move to next step
      dispatch(setTransporterStep(3));
      onNext?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save vehicle details");
    }
  };

  /* ===================== HANDLE BACK ===================== */
  const handleBack = () => {
    dispatch(setTransporterStep(1));
    onBack?.();
  };

  /* ===================== UI ===================== */
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Step 2 — Vehicle Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="totalGaadi"
          placeholder="Total Gaadi"
          value={local.totalGaadi}
          onChange={handleChange}
          className="input"
        />
        <input
          name="make"
          placeholder="Make"
          value={local.make}
          onChange={handleChange}
          className="input"
        />
        <input
          name="gaadiModelFrom"
          placeholder="Gaadi Model From (YYYY)"
          value={local.gaadiModelFrom}
          onChange={handleChange}
          className="input"
        />
        <input
          name="gaadiModelTo"
          placeholder="Gaadi Model To (YYYY)"
          value={local.gaadiModelTo}
          onChange={handleChange}
          className="input"
        />
        <input
          name="gaadiNumber"
          placeholder="Gaadi Number"
          value={local.gaadiNumber}
          onChange={handleChange}
          className="input"
        />
        <select
          name="postOfVehicle"
          value={local.postOfVehicle}
          onChange={handleChange}
          className="input"
        >
          <option value="">Select Vehicle Type</option>
          <option value="HCV">HCV</option>
          <option value="LCV">LCV</option>
          <option value="LOADING">LOADING</option>
          <option value="CAR">CAR</option>
          <option value="BIKE">BIKE</option>
        </select>
        <input
          name="gaadiRouteFrom"
          placeholder="Route From"
          value={local.gaadiRouteFrom}
          onChange={handleChange}
          className="input"
        />
        <input
          name="gaadiRouteTo"
          placeholder="Route To"
          value={local.gaadiRouteTo}
          onChange={handleChange}
          className="input"
        />
        <input
          name="otherKnownTransporterInWtl"
          placeholder="Other Known Transporter in WTL"
          value={local.otherKnownTransporterInWtl}
          onChange={handleChange}
          className="input"
        />
        <input
          name="mobileNumber"
          placeholder="Mobile Number"
          value={local.mobileNumber}
          onChange={handleChange}
          className="input"
        />
        <select
          name="hirePayment"
          value={local.hirePayment}
          onChange={handleChange}
          className="input"
        >
          <option value="">Hire Payment</option>
          <option value="TRANSPORT_ACCOUNT">Transport Account</option>
          <option value="DRIVER">Driver</option>
        </select>
        <input
          name="paymentTerms"
          placeholder="Payment Terms"
          value={local.paymentTerms}
          onChange={handleChange}
          className="input"
        />
        <input
          name="payment30thDate"
          placeholder="Payment 30th Date"
          value={local.payment30thDate}
          onChange={handleChange}
          className="input"
        />
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={handleBack} className="btn-secondary">
          ← Back
        </button>
        <button onClick={handleNext} className="btn-primary">
          Next →
        </button>
      </div>
    </div>
  );
}
