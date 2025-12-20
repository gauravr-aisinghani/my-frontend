// src/components/DriverDetailsForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateStep1,
  setStep,
  selectDriverRegistration,
  setRegistrationId,
} from "../store/driverRegistrationSlice";

import { saveDriverDetails } from "../api/driverDetailsApi";

export default function DriverDetailsForm({ onNext }) {
  const dispatch = useDispatch();
  const reg = useSelector(selectDriverRegistration);

  // ⭐ Always clean form on load
  const initial = {
    fullName: "",
    fatherName: "",
    motherName: "",
    drink: "NO",
    gender: "",
    dob: "",
    age: "",
    education: "",
    languageKnown: "",
    bloodGroup: "",
    aadharNo: "",
    bhamashahNo: "",
    category: "",
    addressLine: "",
    village: "",
    tehsil: "",
    policeStation: "",
    district: "",
    state: "",
    pinCode: "",
    mobile1: "",
    mobile2: "",
  };

  const [local, setLocal] = useState(initial);

  const [otpSent, setOtpSent] = useState(false);
  const [mockOtp, setMockOtp] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auto age calculation
  useEffect(() => {
    if (local.dob) {
      const birth = new Date(local.dob);
      const diff = Date.now() - birth.getTime();
      const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
      setLocal((p) => ({ ...p, age }));
    }
  }, [local.dob]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Numeric validations
    if (["mobile1", "mobile2", "pinCode", "aadharNo", "bhamashahNo"].includes(name)) {
      if (!/^\d*$/.test(value)) return;
    }

    if ((name === "mobile1" || name === "mobile2") && value.length > 10) return;
    if (name === "pinCode" && value.length > 6) return;
    if (name === "aadharNo" && value.length > 12) return;

    setLocal((p) => ({ ...p, [name]: value }));
  };

  const sendOtp = () => {
    if (!/^\d{10}$/.test(local.mobile1)) {
      alert("Enter a valid 10-digit mobile number.");
      return;
    }

    const otp = String(100000 + Math.floor(Math.random() * 900000));
    setMockOtp(otp);
    setOtpSent(true);
    alert("Mock OTP for testing: " + otp);
  };

  const verifyOtp = () => {
    if (otpValue === mockOtp) {
      setOtpVerified(true);
      alert("OTP verified successfully!");
    } else {
      alert("Invalid OTP.");
    }
  };

  // Validation
  const validate = () => {
    if (!local.fullName) return "Full Name is required";
    if (!local.fatherName) return "Father Name is required";
    if (!local.drink) return "Drink selection is required";
    if (!local.gender) return "Gender is required";
    if (!local.dob) return "Date of Birth is required";
    if (!/^\d{10}$/.test(local.mobile1)) return "Primary Mobile must be 10 digits";
    if (!/^\d{12}$/.test(local.aadharNo)) return "Aadhar must be 12 digits";
    if (!local.category) return "Category is required";
    if (!local.village) return "Village is required";
    if (!local.tehsil) return "Tehsil is required";
    if (!local.policeStation) return "Police Station is required";
    if (!local.district) return "District is required";
    if (!local.state) return "State is required";
    return null;
  };

  const next = async () => {
    const err = validate();
    if (err) return alert(err);

    if (!otpVerified) {
      alert("Please verify OTP before continuing.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        full_name: local.fullName,
        father_name: local.fatherName,
        mother_name: local.motherName,
        drink: local.drink,
        gender: local.gender,
        dob: local.dob,
        age: local.age,
        education: local.education,
        language_known: local.languageKnown,
        mobile_number: local.mobile1,
        mobile_number_alt: local.mobile2,
        blood_group: local.bloodGroup,
        aadhar_no: local.aadharNo,
        bhamashah_no: local.bhamashahNo,
        category: local.category,
        colony_house_no: local.addressLine,
        village: local.village,
        tehsil: local.tehsil,
        police_station: local.policeStation,
        district: local.district,
        state: local.state,
        pincode: local.pinCode,
      };

      const response = await saveDriverDetails(payload);
      const driverRegId = response?.driver_registration_id;

      if (!driverRegId) {
        alert("Backend did not return driver registration id");
        return;
      }

      // Save only registration ID (important for next steps)
      dispatch(setRegistrationId(driverRegId));

      // ⭐ VERY IMPORTANT FIX:
      dispatch(updateStep1({}));   // Clear Redux
      setLocal(initial);           // Clear UI fields

      dispatch(setStep(2));
      onNext?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save driver details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Personal Details</h2>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <input name="fullName" value={local.fullName} onChange={handleChange} placeholder="Full Name *" className="input" />
        <input name="fatherName" value={local.fatherName} onChange={handleChange} placeholder="Father Name *" className="input" />
        <input name="motherName" value={local.motherName} onChange={handleChange} placeholder="Mother Name" className="input" />

        {/* Drink */}
        <div>
          <label className="font-semibold">Drink *</label>
          <select name="drink" value={local.drink} onChange={handleChange} className="input">
            <option value="NO">NO</option>
            <option value="YES">YES</option>
          </select>
        </div>

        {/* Gender */}
        <div>
          <label className="font-semibold">Gender *</label>
          <select name="gender" value={local.gender} onChange={handleChange} className="input">
            <option value="">Select Gender *</option>
            <option>MALE</option>
            <option>FEMALE</option>
            <option>OTHER</option>
          </select>
        </div>

        <input type="date" name="dob" value={local.dob} onChange={handleChange} className="input" />

        <input name="age" value={local.age} readOnly placeholder="Age" className="input bg-gray-100" />

        <input name="education" value={local.education} onChange={handleChange} placeholder="Education" className="input" />
        <input name="languageKnown" value={local.languageKnown} onChange={handleChange} placeholder="Language Known" className="input" />
<div>
  <label className="font-semibold">Blood Group</label>
  <select
    name="bloodGroup"
    value={local.bloodGroup}
    onChange={handleChange}
    className="input"
  >
    <option value="">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
  </select>
</div>

        <input name="aadharNo" value={local.aadharNo} onChange={handleChange} placeholder="Aadhar Number *" className="input" />
        <input name="bhamashahNo" value={local.bhamashahNo} onChange={handleChange} placeholder="Bhamashah Card No" className="input" />
        <input name="category" value={local.category} onChange={handleChange} placeholder="Category *" className="input" />
      </div>

      {/* ADDRESS */}
      <h2 className="text-2xl font-bold text-green-700 mb-4">Address</h2>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <input name="addressLine" value={local.addressLine} onChange={handleChange} placeholder="Colony / House No." className="input" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="village" value={local.village} onChange={handleChange} placeholder="Village *" className="input" />
          <input name="tehsil" value={local.tehsil} onChange={handleChange} placeholder="Tehsil *" className="input" />
          <input name="policeStation" value={local.policeStation} onChange={handleChange} placeholder="Police Station *" className="input" />
          <input name="district" value={local.district} onChange={handleChange} placeholder="District *" className="input" />
          <input name="state" value={local.state} onChange={handleChange} placeholder="State *" className="input" />
          <input name="pinCode" value={local.pinCode} onChange={handleChange} placeholder="Pin Code" className="input" />
        </div>
      </div>

      {/* MOBILE + OTP */}
      <h2 className="text-2xl font-bold text-green-700 mb-4">Mobile Verification</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="font-semibold">Mobile Number *</label>
          <div className="flex gap-2">
            <input name="mobile1" value={local.mobile1} onChange={handleChange} placeholder="10-digit Mobile" className="input flex-1" />
            <button onClick={sendOtp} className="btn">Send OTP</button>
          </div>
        </div>

        <div>
          <label className="font-semibold">Mobile Number (Optional)</label>
          <input name="mobile2" value={local.mobile2} onChange={handleChange} placeholder="Alternate Mobile" className="input" />
        </div>

        <div>
          <label className="font-semibold">OTP</label>
          <div className="flex gap-2">
            <input value={otpValue} onChange={(e) => setOtpValue(e.target.value)} placeholder="Enter OTP" className="input flex-1" />
            <button disabled={!otpSent} onClick={verifyOtp} className="btn">Verify</button>
          </div>

          {otpVerified && <p className="text-green-600 font-semibold">OTP Verified ✔</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={next} disabled={loading} className="btn-primary">
          {loading ? "Saving..." : "Next →"}
        </button>
      </div>
    </div>
  );
}
