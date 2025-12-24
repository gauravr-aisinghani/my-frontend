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

  const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const EDUCATION_LEVELS = [
  "Illiterate",
  "Primary",
  "Secondary",
  "Higher Secondary",
  "Graduate",
  "Postgraduate"
];


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

         case "gender":
      if (!value) msg = "Gender is required";
      break;

    case "bloodGroup":
      if (!value) msg = "Blood group is required";
      break;

    case "education":
      if (!value) msg = "Education is required";
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

  /* 🔹 CAMEL → SNAKE CASE PAYLOAD */
  const toSnakeCasePayload = (data) => ({
    full_name: data.fullName,
    father_name: data.fatherName,
    mother_name: data.motherName,
    drink: data.drink,
    gender: data.gender,
    dob: data.dob,
    age: data.age,
    education: data.education,
    language_known: data.languageKnown,
    blood_group: data.bloodGroup,
    aadhar_no: data.aadharNo,
    bhamashah_no: data.bhamashahNo,
    category: data.category,
    address_line: data.addressLine,
    village: data.village,
    tehsil: data.tehsil,
    police_station: data.policeStation,
    district: data.district,
    state: data.state,
    pin_code: data.pinCode,
    mobile_number: data.mobile1,
    mobile_number_alt: data.mobile2,
  });

  /* 🔹 SUBMIT HANDLER */
  const next = async () => {
    const hasError = Object.values(errors).some(e => e);
    if (hasError) {
      alert("Please fix validation errors");
      return;
    }

    setLoading(true);
    try {
      const payload = toSnakeCasePayload(local);
      const res = await saveDriverDetails(payload);

      dispatch(setRegistrationId(res.driver_registration_id));
      dispatch(updateStep1(local));
      dispatch(setStep(2));
      onNext?.();
    } catch {
      alert("Failed to save driver details");
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ return JSX remains exactly as you already have it



return (
  <div className="max-w-6xl mx-auto bg-white p-3 rounded-lg shadow-sm">
    <h2 className="text-lg font-semibold mb-3 border-b pb-1">
      Personal Details
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

      {/* Full Name */}
      <div>
        <input
          name="fullName"
          value={local.fullName}
          onChange={handleChange}
          onBlur={(e) => validateField("fullName", e.target.value)}
          className={inputClass("fullName")}
          placeholder="Full Name *"
        />
        {errors.fullName && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.fullName}</p>
        )}
      </div>

      {/* Father Name */}
      <div>
        <input
          name="fatherName"
          value={local.fatherName}
          onChange={handleChange}
          onBlur={(e) => validateField("fatherName", e.target.value)}
          className={inputClass("fatherName")}
          placeholder="Father Name *"
        />
        {errors.fatherName && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.fatherName}</p>
        )}
      </div>

      {/* Mother Name */}
      <div>
        <input
          name="motherName"
          value={local.motherName}
          onChange={handleChange}
          className="input"
          placeholder="Mother Name"
        />
      </div>

      {/* DOB */}
      <div>
        <label className="block text-[11px] font-medium mb-0.5">
          Date of Birth *
        </label>
        <input
          type="date"
          name="dob"
          value={local.dob}
          onChange={handleChange}
          onBlur={(e) => validateField("dob", e.target.value)}
          className={inputClass("dob")}
        />
        {errors.dob && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.dob}</p>
        )}
      </div>

      {/* Age */}
      <div>
        <input
          value={local.age}
          disabled
          className="input bg-gray-100 cursor-not-allowed"
          placeholder="Age"
        />
      </div>

      <div>
  <select
    name="gender"
    value={local.gender}
    onChange={handleChange}
    onBlur={(e) => validateField("gender", e.target.value)}
    className={inputClass("gender")}
  >
    <option value="">Select Gender *</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>
  {errors.gender && (
    <p className="text-red-500 text-[11px] mt-0.5">{errors.gender}</p>
  )}
</div>


<div>
  <select
    name="bloodGroup"
    value={local.bloodGroup}
    onChange={handleChange}
    onBlur={(e) => validateField("bloodGroup", e.target.value)}
    className={inputClass("bloodGroup")}
  >
    <option value="">Select Blood Group *</option>
    {BLOOD_GROUPS.map(bg => (
      <option key={bg} value={bg}>{bg}</option>
    ))}
  </select>
  {errors.bloodGroup && (
    <p className="text-red-500 text-[11px] mt-0.5">{errors.bloodGroup}</p>
  )}
</div>

<div>
  <select
    name="education"
    value={local.education}
    onChange={handleChange}
    onBlur={(e) => validateField("education", e.target.value)}
    className={inputClass("education")}
  >
    <option value="">Select Education *</option>
    {EDUCATION_LEVELS.map(ed => (
      <option key={ed} value={ed}>{ed}</option>
    ))}
  </select>
  {errors.education && (
    <p className="text-red-500 text-[11px] mt-0.5">{errors.education}</p>
  )}
</div>



      {/* Language */}
      <div>
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
      </div>

      {/* Aadhar */}
      <div>
        <input
          name="aadharNo"
          value={local.aadharNo}
          onChange={handleChange}
          onBlur={(e) => validateField("aadharNo", e.target.value)}
          className={inputClass("aadharNo")}
          placeholder="Aadhar Number *"
        />
        {errors.aadharNo && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.aadharNo}</p>
        )}
      </div>

      {/* Bhamashah */}
      <div>
        <input
          name="bhamashahNo"
          value={local.bhamashahNo}
          onChange={handleChange}
          onBlur={(e) => validateField("bhamashahNo", e.target.value)}
          className={inputClass("bhamashahNo")}
          placeholder="Bhamashah Card Number"
        />
        {errors.bhamashahNo && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.bhamashahNo}</p>
        )}
      </div>

      {/* Category */}
      <div>
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
          <p className="text-red-500 text-[11px] mt-0.5">{errors.category}</p>
        )}
      </div>

      {/* Address */}
      <div className="md:col-span-2 lg:col-span-3">
        <input
          name="addressLine"
          value={local.addressLine}
          onChange={handleChange}
          className="input"
          placeholder="Address Line"
        />
      </div>

      <input name="village" value={local.village} onChange={handleChange} className="input" placeholder="Village" />
      <input name="tehsil" value={local.tehsil} onChange={handleChange} className="input" placeholder="Tehsil" />
      <input name="policeStation" value={local.policeStation} onChange={handleChange} className="input" placeholder="Police Station" />
      <input name="district" value={local.district} onChange={handleChange} className="input" placeholder="District" />

      {/* State */}
      <div>
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
          <p className="text-red-500 text-[11px] mt-0.5">{errors.state}</p>
        )}
      </div>

      {/* Pin */}
      <div>
        <input
          name="pinCode"
          value={local.pinCode}
          onChange={handleChange}
          onBlur={(e) => validateField("pinCode", e.target.value)}
          className={inputClass("pinCode")}
          placeholder="Pin Code"
        />
        {errors.pinCode && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.pinCode}</p>
        )}
      </div>

      {/* Mobile */}
      <div>
        <input
          name="mobile1"
          value={local.mobile1}
          onChange={handleChange}
          onBlur={(e) => validateField("mobile1", e.target.value)}
          className={inputClass("mobile1")}
          placeholder="Mobile Number *"
        />
        {errors.mobile1 && (
          <p className="text-red-500 text-[11px] mt-0.5">{errors.mobile1}</p>
        )}
      </div>

      <div>
        <input
          name="mobile2"
          value={local.mobile2}
          onChange={handleChange}
          onBlur={(e) => validateField("mobile2", e.target.value)}
          className={inputClass("mobile2")}
          placeholder="Alternate Mobile Number"
        />
      </div>

    </div>

    <div className="flex justify-end mt-4">
      <button
        onClick={next}
        disabled={loading}
        className="btn-primary px-4 py-1.5 text-xs"
      >
        {loading ? "Saving..." : "Next →"}
      </button>
    </div>
  </div>
);


  

}


