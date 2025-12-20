// src/components/TransporterStep2Vehicle.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTransporterStep } from "../store/transporterRegistrationSlice";
import { saveTransporterVehicle } from "../api/transporterVehicleApi";

export default function TransporterStep2Vehicle({ onNext, onBack }) {
  const dispatch = useDispatch();

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

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mobile number validation
    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    setLocal((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= HANDLE NEXT ================= */
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

    // ---------------- VALIDATIONS ----------------
    if (!transporterRegistrationId) return alert("Transporter registration missing.");
    if (!totalGaadi || Number(totalGaadi) <= 0) return alert("Total Gaadi required.");
    if (!make.trim()) return alert("Make is required.");
    if (!gaadiNumber.trim()) return alert("Gaadi Number required.");
    if (!postOfVehicle) return alert("Select Post of Vehicle.");
    if (!hirePayment) return alert("Select Hire Payment.");
    if (!paymentTerms.trim()) return alert("Payment Terms required.");
    if (!payment30thDate.trim()) return alert("Payment 30th Date required.");

    // ---------------- YEAR VALIDATION ----------------
    const yearRegex = /^\d{4}$/;
    let fromYear = null;
    let toYear = null;

    if (gaadiModelFrom.trim()) {
      if (!yearRegex.test(gaadiModelFrom.trim())) {
        return alert("Gaadi Model From must be a 4-digit year.");
      }
      fromYear = Number(gaadiModelFrom.trim());
    } else {
      return alert("Gaadi Model From is required.");
    }

    if (gaadiModelTo.trim()) {
      if (!yearRegex.test(gaadiModelTo.trim())) {
        return alert("Gaadi Model To must be a 4-digit year.");
      }
      toYear = Number(gaadiModelTo.trim());
    }

    try {
      // ---------------- PAYLOAD (snake_case) ----------------
      const payload = {
        transporter_registration_id: transporterRegistrationId,
        total_gaadi: Number(totalGaadi),
        make: make.trim(),
        gaadi_model_from: fromYear,
        gaadi_model_to: toYear || null,
        gaadi_number: gaadiNumber.trim(),
        post_of_vehicle: postOfVehicle,
        gaadi_route_from: local.gaadiRouteFrom?.trim() || null,
        gaadi_route_to: local.gaadiRouteTo?.trim() || null,
        other_known_transporter_in_wtl: local.otherKnownTransporterInWtl?.trim() || null,
        mobile_number: local.mobileNumber?.trim() || null,
        hire_payment: hirePayment,
        payment_terms: paymentTerms.trim(),
        payment_30th_date: payment30thDate.trim(),
      };

      console.log("Payload sent to API:", payload);

      await saveTransporterVehicle(payload);

      dispatch(setTransporterStep(3));
      onNext?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save vehicle details");
    }
  };

  /* ================= HANDLE BACK ================= */
  const handleBack = () => {
    dispatch(setTransporterStep(1));
    onBack?.();
  };

  /* ================= UI ================= */
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Step 2 — Vehicle Details</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="totalGaadi" placeholder="Total Gaadi" value={local.totalGaadi} onChange={handleChange} className="input" />
        <input name="make" placeholder="Make" value={local.make} onChange={handleChange} className="input" />
        <input name="gaadiModelFrom" placeholder="Gaadi Model From (YYYY)" value={local.gaadiModelFrom} onChange={handleChange} className="input" />
        <input name="gaadiModelTo" placeholder="Gaadi Model To (YYYY)" value={local.gaadiModelTo} onChange={handleChange} className="input" />
        <input name="gaadiNumber" placeholder="Gaadi Number" value={local.gaadiNumber} onChange={handleChange} className="input" />

        <select name="postOfVehicle" value={local.postOfVehicle} onChange={handleChange} className="input">
          <option value="">Select Vehicle Type</option>
          <option value="HCV">HCV</option>
          <option value="LCV">LCV</option>
          <option value="LOADING">LOADING</option>
          <option value="CAR">CAR</option>
          <option value="BIKE">BIKE</option>
        </select>

        <input name="gaadiRouteFrom" placeholder="Route From" value={local.gaadiRouteFrom} onChange={handleChange} className="input" />
        <input name="gaadiRouteTo" placeholder="Route To" value={local.gaadiRouteTo} onChange={handleChange} className="input" />
        <input name="otherKnownTransporterInWtl" placeholder="Other Known Transporter in WTL" value={local.otherKnownTransporterInWtl} onChange={handleChange} className="input" />
        <input name="mobileNumber" placeholder="Mobile Number" value={local.mobileNumber} onChange={handleChange} className="input" />

        <select name="hirePayment" value={local.hirePayment} onChange={handleChange} className="input">
          <option value="">Hire Payment</option>
          <option value="TRANSPORT_ACCOUNT">Transport Account</option>
          <option value="DRIVER">Driver</option>
        </select>

        <input name="paymentTerms" placeholder="Payment Terms" value={local.paymentTerms} onChange={handleChange} className="input" />
        <input name="payment30thDate" placeholder="Payment 30th Date" value={local.payment30thDate} onChange={handleChange} className="input" />
      </div>

      <div className="mt-6 flex justify-between">
        <button onClick={handleBack} className="btn-secondary">← Back</button>
        <button onClick={handleNext} className="btn-primary">Next →</button>
      </div>
    </div>
  );
}
