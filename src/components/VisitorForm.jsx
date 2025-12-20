import React, { useState } from "react";
import { addVisitor } from "../api/visitorsApi";

export default function VisitorForm({ onAddSuccess }) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    driverName: "",
    location: "",
    mobileNo: "",
    otherMobile: "",
    relativeName: "",
    relativeMobile: "",
    gaadi: "",
    underload: false,
    overload: false,
    preferredLocation: "",
    preferredSalary: "",
    regularTiming: "",
    leaveTime: "",
    anyIssue: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addVisitor(formData);
      alert("✅ Visitor Added Successfully!");
      onAddSuccess();
      setFormData({
        date: "",
        time: "",
        driverName: "",
        location: "",
        mobileNo: "",
        otherMobile: "",
        relativeName: "",
        relativeMobile: "",
        gaadi: "",
        underload: false,
        overload: false,
        preferredLocation: "",
        preferredSalary: "",
        regularTiming: "",
        leaveTime: "",
        anyIssue: "",
        notes: "",
      });
    } catch (error) {
      console.error("Error adding visitor:", error);
      alert("❌ Failed to add visitor!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-center text-gray-700">
        Daily Visitors / Enquiry Form
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.keys(formData).map((key) =>
          typeof formData[key] !== "boolean" ? (
            <input
              key={key}
              type="text"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              placeholder={key.replace(/([A-Z])/g, " $1").toUpperCase()}
              className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={key}
                checked={formData[key]}
                onChange={handleChange}
              />
              <span>{key.toUpperCase()}</span>
            </label>
          )
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Add Visitor
      </button>
    </form>
  );
}
