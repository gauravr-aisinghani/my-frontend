import React, { useState } from "react";
import { sendDriverDetails } from "../api/driverApi";
import { useNavigate } from "react-router-dom";

const DriverDetails = () => {
    const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    fatherName: "",
    motherName: "",
    drink: "",
    gender: "",
    education: "",
    languageKnown: "",
    bloodGroup: "",
    aadharNo: "",
    bhamashahCardNo: "",
    category: "",
    dob: "",
    addressLine: "",
    village: "",
    tehsil: "",
    policeStation: "",
    district: "",
    state: "",
    pinCode: "",
    mobile1: "",
    mobile2: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await driverApi.saveDriverDetails(formData); // your existing API call
    alert("Driver details saved successfully!");
    navigate("/licence-details"); // ✅ move to next page
  } catch (err) {
    console.error(err);
    alert("Error saving details");
  }
};


  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl p-8 rounded-xl shadow-md space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700">
          Driver Details
        </h2>

        {/* Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name of Driver" name="fullName" value={form.fullName} onChange={handleChange} />
          <Input label="Father Name" name="fatherName" value={form.fatherName} onChange={handleChange} />
          <Input label="Mother Name" name="motherName" value={form.motherName} onChange={handleChange} />
          <Select label="Drink" name="drink" value={form.drink} onChange={handleChange} options={["Yes", "No"]} />
          <Select label="Gender" name="gender" value={form.gender} onChange={handleChange} options={["Male", "Female", "Other"]} />
          <Input label="Education Qualification" name="education" value={form.education} onChange={handleChange} />
          <Input label="Language Known" name="languageKnown" value={form.languageKnown} onChange={handleChange} />
          <Input label="Blood Group" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} />
          <Input label="Aadhar No." name="aadharNo" value={form.aadharNo} onChange={handleChange} />
          <Input label="Bhamashah Card No." name="bhamashahCardNo" value={form.bhamashahCardNo} onChange={handleChange} />
          <Input label="Category" name="category" value={form.category} onChange={handleChange} />
          <Input label="Date of Birth" type="date" name="dob" value={form.dob} onChange={handleChange} />
        </div>

        {/* Address */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4">Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Dhani / Colony / Flat No." name="addressLine" value={form.addressLine} onChange={handleChange} />
          <Input label="Village" name="village" value={form.village} onChange={handleChange} />
          <Input label="Tehsil" name="tehsil" value={form.tehsil} onChange={handleChange} />
          <Input label="Police Station" name="policeStation" value={form.policeStation} onChange={handleChange} />
          <Input label="District" name="district" value={form.district} onChange={handleChange} />
          <Input label="State" name="state" value={form.state} onChange={handleChange} />
          <Input label="Pin Code" name="pinCode" value={form.pinCode} onChange={handleChange} />
        </div>

        {/* Contact */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4">Contact Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Mobile No. 1" name="mobile1" value={form.mobile1} onChange={handleChange} />
          <Input label="Mobile No. 2" name="mobile2" value={form.mobile2} onChange={handleChange} />
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

// 🧱 Reusable input components
const Input = ({ label, name, type = "text", value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
    />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
    >
      <option value="">Select</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default DriverDetails;
