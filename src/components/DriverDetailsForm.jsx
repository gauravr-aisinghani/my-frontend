import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateStep1,
  setStep,
  setRegistrationId,
} from "../store/driverRegistrationSlice";
import { saveDriverDetails } from "../api/driverDetailsApi";

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
  "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha",
  "Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh",
  "Uttarakhand","West Bengal"
];

const LANGUAGES = [
  "Hindi","English","Marathi","Gujarati","Punjabi","Bengali",
  "Tamil","Telugu","Kannada","Malayalam","Odia","Urdu"
];

export default function DriverDetailsForm({ onNext }) {
  const dispatch = useDispatch();

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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* 🔹 AUTO AGE CALCULATION FROM DOB */
  useEffect(() => {
    if (local.dob) {
      const birthDate = new Date(local.dob);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      setLocal(prev => ({ ...prev, age }));
    }
  }, [local.dob]);

  /* 🔹 CHANGE HANDLER (digit-only + max length) */
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["mobile1","mobile2","pinCode","aadharNo","bhamashahNo"].includes(name) &&
      !/^\d*$/.test(value)
    ) return;

    if (name === "aadharNo" && value.length > 12) return;
    if (name === "pinCode" && value.length > 6) return;
    if ((name === "mobile1" || name === "mobile2") && value.length > 10) return;
    if (name === "bhamashahNo" && value.length > 12) return;

    setLocal(prev => ({ ...prev, [name]: value }));
  };

  /* 🔹 INLINE VALIDATION (ON BLUR) */
  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) msg = "Full name is required";
        break;

      case "fatherName":
        if (!value.trim()) msg = "Father name is required";
        break;

      case "dob":
        if (!value) msg = "Date of birth is required";
        else if (local.age < 18)
          msg = "Driver must be at least 18 years old";
        break;

      case "aadharNo":
        if (!/^\d{12}$/.test(value))
          msg = "Aadhar number must be exactly 12 digits";
        break;

      case "bhamashahNo":
        if (value && !/^\d{8,12}$/.test(value))
          msg = "Bhamashah number must be 8–12 digits";
        break;

      case "pinCode":
        if (value && !/^\d{6}$/.test(value))
          msg = "Pin code must be 6 digits";
        break;

      case "mobile1":
        if (!/^\d{10}$/.test(value))
          msg = "Mobile number must be 10 digits";
        break;

      case "mobile2":
        if (value && !/^\d{10}$/.test(value))
          msg = "Alternate mobile must be 10 digits";
        break;

      case "category":
        if (!value) msg = "Category is required";
        break;

      case "state":
        if (!value) msg = "State is required";
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [name]: msg }));
  };

  const inputClass = (name) =>
    `input ${errors[name] ? "border-red-500" : ""}`;

  /* 🔹 SUBMIT HANDLER */
  const next = async () => {
    const hasError = Object.values(errors).some(e => e);
    if (hasError) {
      alert("Please fix validation errors");
      return;
    }

    setLoading(true);
    try {
      const res = await saveDriverDetails(local);
      dispatch(setRegistrationId(res.driver_registration_id));
      dispatch(updateStep1(local));
      dispatch(setStep(2));
      onNext?.();
    } catch {
      alert("Failed to save driver details");
    } finally {
      setLoading(false);
    }

    return (
  <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
    <h2 className="text-2xl font-bold mb-4">Personal Details</h2>

    {/* Full Name */}
    <input
      name="fullName"
      value={local.fullName}
      onChange={handleChange}
      onBlur={(e) => validateField("fullName", e.target.value)}
      className={inputClass("fullName")}
      placeholder="Full Name *"
    />
    {errors.fullName && (
      <p className="text-red-500 text-sm">{errors.fullName}</p>
    )}

    {/* Father Name */}
    <input
      name="fatherName"
      value={local.fatherName}
      onChange={handleChange}
      onBlur={(e) => validateField("fatherName", e.target.value)}
      className={inputClass("fatherName")}
      placeholder="Father Name *"
    />
    {errors.fatherName && (
      <p className="text-red-500 text-sm">{errors.fatherName}</p>
    )}

    {/* Mother Name */}
    <input
      name="motherName"
      value={local.motherName}
      onChange={handleChange}
      className="input"
      placeholder="Mother Name"
    />

    {/* DOB */}
    <label className="block mt-3 font-medium">Date of Birth *</label>
    <input
      type="date"
      name="dob"
      value={local.dob}
      onChange={handleChange}
      onBlur={(e) => validateField("dob", e.target.value)}
      className={inputClass("dob")}
    />
    {errors.dob && (
      <p className="text-red-500 text-sm">{errors.dob}</p>
    )}

    {/* Age (auto calculated) */}
    <input
      value={local.age}
      disabled
      className="input bg-gray-100"
      placeholder="Age"
    />

    {/* Language Known */}
    <select
      name="languageKnown"
      value={local.languageKnown}
      onChange={handleChange}
      className="input"
    >
      <option value="">Select Language</option>
      {LANGUAGES.map((l) => (
        <option key={l} value={l}>{l}</option>
      ))}
    </select>

    {/* Aadhar Number */}
    <input
      name="aadharNo"
      value={local.aadharNo}
      onChange={handleChange}
      onBlur={(e) => validateField("aadharNo", e.target.value)}
      className={inputClass("aadharNo")}
      placeholder="Aadhar Number *"
    />
    {errors.aadharNo && (
      <p className="text-red-500 text-sm">{errors.aadharNo}</p>
    )}

    {/* Bhamashah Number */}
    <input
      name="bhamashahNo"
      value={local.bhamashahNo}
      onChange={handleChange}
      onBlur={(e) => validateField("bhamashahNo", e.target.value)}
      className={inputClass("bhamashahNo")}
      placeholder="Bhamashah Card Number"
    />
    {errors.bhamashahNo && (
      <p className="text-red-500 text-sm">{errors.bhamashahNo}</p>
    )}

    {/* Category */}
    <select
      name="category"
      value={local.category}
      onChange={handleChange}
      onBlur={(e) => validateField("category", e.target.value)}
      className={inputClass("category")}
    >
      <option value="">Select Category *</option>
      <option value="GENERAL">GENERAL</option>
      <option value="OBC">OBC</option>
      <option value="SC">SC</option>
      <option value="ST">ST</option>
    </select>
    {errors.category && (
      <p className="text-red-500 text-sm">{errors.category}</p>
    )}

    {/* Address Line */}
    <input
      name="addressLine"
      value={local.addressLine}
      onChange={handleChange}
      className="input"
      placeholder="Address Line"
    />

    {/* Village */}
    <input
      name="village"
      value={local.village}
      onChange={handleChange}
      className="input"
      placeholder="Village"
    />

    {/* Tehsil */}
    <input
      name="tehsil"
      value={local.tehsil}
      onChange={handleChange}
      className="input"
      placeholder="Tehsil"
    />

    {/* Police Station */}
    <input
      name="policeStation"
      value={local.policeStation}
      onChange={handleChange}
      className="input"
      placeholder="Police Station"
    />

    {/* District */}
    <input
      name="district"
      value={local.district}
      onChange={handleChange}
      className="input"
      placeholder="District"
    />

    {/* State */}
    <select
      name="state"
      value={local.state}
      onChange={handleChange}
      onBlur={(e) => validateField("state", e.target.value)}
      className={inputClass("state")}
    >
      <option value="">Select State *</option>
      {STATES.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
    {errors.state && (
      <p className="text-red-500 text-sm">{errors.state}</p>
    )}

    {/* Pin Code */}
    <input
      name="pinCode"
      value={local.pinCode}
      onChange={handleChange}
      onBlur={(e) => validateField("pinCode", e.target.value)}
      className={inputClass("pinCode")}
      placeholder="Pin Code"
    />
    {errors.pinCode && (
      <p className="text-red-500 text-sm">{errors.pinCode}</p>
    )}

    {/* Mobile 1 */}
    <input
      name="mobile1"
      value={local.mobile1}
      onChange={handleChange}
      onBlur={(e) => validateField("mobile1", e.target.value)}
      className={inputClass("mobile1")}
      placeholder="Mobile Number *"
    />
    {errors.mobile1 && (
      <p className="text-red-500 text-sm">{errors.mobile1}</p>
    )}

    {/* Mobile 2 */}
    <input
      name="mobile2"
      value={local.mobile2}
      onChange={handleChange}
      onBlur={(e) => validateField("mobile2", e.target.value)}
      className={inputClass("mobile2")}
      placeholder="Alternate Mobile Number"
    />

    {/* Submit */}
    <button
      onClick={next}
      disabled={loading}
      className="btn-primary mt-6"
    >
      {loading ? "Saving..." : "Next →"}
    </button>
  </div>
);

    
  };
}


