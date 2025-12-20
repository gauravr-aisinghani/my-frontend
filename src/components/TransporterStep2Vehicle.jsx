import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTransporterStep } from "../store/transporterRegistrationSlice";
import { saveTransporterVehicle } from "../api/transporterVehicleApi";

export default function TransporterStep2Vehicle({ onNext }) {
  const dispatch = useDispatch();

  // ✅ Transporter registration id from store
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber") {
      if (!/^\d*$/.test(value) || value.length > 10) return;
    }

    setLocal((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    if (
      !transporterRegistrationId ||
      !local.totalGaadi ||
      !local.make ||
      !local.gaadiNumber ||
      !local.postOfVehicle ||
      !local.hirePayment
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      // ✅ SNAKE_CASE PAYLOAD (as requested)
      const payload = {
        transporter_registration_id: transporterRegistrationId,
        total_gaadi: Number(local.totalGaadi),
        make: local.make,
        gaadi_model_from: Number(local.gaadiModelFrom),
        gaadi_model_to: local.gaadiModelTo
          ? Number(local.gaadiModelTo)
          : null,
        gaadi_number: local.gaadiNumber,
        post_of_vehicle: local.postOfVehicle, // ENUM STRING
        gaadi_route_from: local.gaadiRouteFrom,
        gaadi_route_to: local.gaadiRouteTo,
        other_known_transporter_in_wtl:
          local.otherKnownTransporterInWtl || null,
        mobile_number: local.mobileNumber || null,
        hire_payment: local.hirePayment, // ENUM STRING
        payment_terms: local.paymentTerms,
        payment_30th_date: local.payment30thDate,
      };

      await saveTransporterVehicle(payload);

      dispatch(setTransporterStep(3));
      onNext?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save vehicle details");
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Step 2 — Vehicle Details
      </h3>

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

      <div className="mt-6 text-right">
        <button onClick={handleNext} className="btn-primary">
          Next →
        </button>
      </div>
    </div>
  );
}
