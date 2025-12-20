// src/components/DailyVisitorForm2.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addVisitor } from "../store/dailyVisitorsSlice";
import dailyVisitorsApi2 from "../api/dailyVisitorApi2";
import { Link } from "react-router-dom";

const DailyVisitorForm2 = () => {
  const dispatch = useDispatch();

  const initialState = {
    driverName: "",
    location: "",
    mobileNo: "",
    grade: "",
    otherMobile: "",
    birthPlace: "",
    relativeName: "",
    relativeMobile: "",
    gaadiDrivenInPast: "",
    underload: false,
    overload: false,
    preferedLocation: "",
    preferedMonthlySalary: "",
    preferredVehicle: "",
    regularTiming: false,
    occasional: false,
    permanent: false,
    anyIssue: "",
    notes: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (
      ["mobileNo", "otherMobile", "relativeMobile", "preferedMonthlySalary"].includes(name)
    ) {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validate = () => {
    if (!formData.driverName.trim()) return "Driver Name is required";
    if (!formData.mobileNo.trim()) return "Mobile No is required";
    if (formData.mobileNo.length !== 10) return "Mobile No must be 10 digits";
    if (!formData.gaadiDrivenInPast.trim()) return "Please select Gaadi Driven in Past";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) return alert(error);

    const payload = {
      driver_name: formData.driverName,
      location: formData.location,
      mobile_no: formData.mobileNo,
      grade: formData.grade,
      other_mobile: formData.otherMobile,
      birth_place: formData.birthPlace,
      relative_name: formData.relativeName,
      relative_mobile: formData.relativeMobile,
      gaadi_driven_in_past: formData.gaadiDrivenInPast,
      underload: formData.underload,
      overload: formData.overload,
      prefered_location: formData.preferedLocation,
      prefered_monthly_salary: formData.preferedMonthlySalary,
      preferred_vehicle: formData.preferredVehicle,
      regular_timing: formData.regularTiming,
      occasional: formData.occasional,
      permanent: formData.permanent,
      any_issue: formData.anyIssue,
      notes: formData.notes,
    };

    try {
      await dailyVisitorsApi2.saveVisitor(payload);
      dispatch(addVisitor(payload));
      alert("Visitor saved successfully!");
      setFormData(initialState);
    } catch (err) {
      console.error(err);
      alert("Error saving visitor ❌");
    }
  };

  const fields = [
    ["driverName", "Driver Name", "text"],
    ["location", "Location", "text"],
    ["mobileNo", "Mobile No", "tel"],
    ["grade", "Grade", "text"],
    ["otherMobile", "Other Mobile", "tel"],
    ["birthPlace", "Birth Place", "text"],
    ["relativeName", "Relative Name", "text"],
    ["relativeMobile", "Relative Mobile", "tel"],
    ["preferedLocation", "Preferred Location", "text"],
    ["preferedMonthlySalary", "Monthly Salary", "number"],
    ["preferredVehicle", "Preferred Vehicle", "text"],
  ];

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-4 sm:p-6 lg:p-8 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-green-600">
            Daily Visitor Entry
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">Fill all required details.</p>
        </div>

        <div className="ml-auto">
          <Link
            to="/dashboard"
            className="inline-block bg-gray-700 hover:bg-gray-800 text-white px-3 py-1.5 rounded-md text-xs sm:text-sm"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Responsive Form Grid
          - 1 column on extra-small
          - 2 columns on small (sm)
          - 3 columns on large (lg)
      */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
      >
        {fields.map(([name, label, type]) => (
          <div key={name} className="flex flex-col">
            <label className="text-xs sm:text-sm text-gray-700 font-medium mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-2 py-2 text-sm sm:text-sm w-full focus:ring-1 focus:ring-green-400"
            />
          </div>
        ))}

        {/* Gaadi - occupies one grid cell */}
        <div className="flex flex-col">
          <label className="text-xs sm:text-sm text-gray-700 font-medium mb-1">Gaadi Driven in Past</label>
          <select
            name="gaadiDrivenInPast"
            value={formData.gaadiDrivenInPast}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-2 py-2 text-sm w-full focus:ring-1 focus:ring-green-400"
          >
            <option value="">Select</option>
            {["Auto", "Taxi", "Pickup", "Tempo", "Bolero", "Bike", "Other"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Load Type */}
        <div className="flex flex-col">
          <label className="text-xs sm:text-sm text-gray-700 font-medium mb-1">Load Type</label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="underload"
                checked={formData.underload}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span className="text-xs sm:text-sm">Underload</span>
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="overload"
                checked={formData.overload}
                onChange={handleChange}
                className="h-4 w-4"
              />
              <span className="text-xs sm:text-sm">Overload</span>
            </label>
          </div>
        </div>

        {/* Timing Preference - make it span 2 cols on md or full width on small screens */}
        <div className="sm:col-span-2 lg:col-span-1 flex flex-col">
          <label className="text-xs sm:text-sm text-gray-700 font-medium mb-1">Timing Preference</label>
          <div className="flex flex-wrap gap-3">
            {[
              ["regularTiming", "Regular"],
              ["occasional", "Occasional"],
              ["permanent", "Permanent"],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name={name}
                  checked={formData[name]}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <span className="text-xs sm:text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Any Issue - full width */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col">
          <label className="text-xs sm:text-sm text-gray-700 font-medium mb-1">Any Issue</label>
          <input
            name="anyIssue"
            value={formData.anyIssue}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-2 py-2 text-sm w-full focus:ring-1 focus:ring-green-400"
          />
        </div>

        {/* Notes - full width */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col">
          <label className="text-xs sm:text-sm text-gray-700 font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-2 py-2 text-sm w-full h-24 resize-vertical focus:ring-1 focus:ring-green-400"
          />
        </div>

        {/* Submit - centered and responsive */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-semibold w-full sm:w-auto"
          >
            Save Visitor
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyVisitorForm2;
