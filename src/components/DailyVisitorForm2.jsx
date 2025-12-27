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
      ["mobileNo", "otherMobile", "relativeMobile", "preferedMonthlySalary"].includes(name) &&
      !/^\d*$/.test(value)
    ) return;

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

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b pb-1">
        <h2 className="text-lg font-semibold">Daily Visitor Entry</h2>
        <Link to="/dashboard" className="text-xs text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {[
          ["driverName", "Driver Name"],
          ["location", "Location"],
          ["mobileNo", "Mobile No"],
          ["grade", "Grade"],
          ["otherMobile", "Other Mobile"],
          ["birthPlace", "Birth Place"],
          ["relativeName", "Relative Name"],
          ["relativeMobile", "Relative Mobile"],
          ["preferedLocation", "Preferred Location"],
          ["preferedMonthlySalary", "Monthly Salary"],
          ["preferredVehicle", "Preferred Vehicle"],
        ].map(([name, label]) => (
          <div key={name}>
            <label className="block text-[11px] font-medium mb-0.5">
              {label}
            </label>
            <input
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="input"
            />
          </div>
        ))}

        {/* Gaadi Driven */}
        <div>
          <label className="block text-[11px] font-medium mb-0.5">
            Gaadi Driven in Past
          </label>
          <select
            name="gaadiDrivenInPast"
            value={formData.gaadiDrivenInPast}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select</option>
            {["Auto", "Taxi", "Pickup", "Tempo", "Bolero", "Bike", "Other"].map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        {/* Load Type */}
        <div>
          <label className="block text-[11px] font-medium mb-0.5">
            Load Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="underload" checked={formData.underload} onChange={handleChange} />
              Underload
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" name="overload" checked={formData.overload} onChange={handleChange} />
              Overload
            </label>
          </div>
        </div>

        {/* Timing */}
        <div>
          <label className="block text-[11px] font-medium mb-0.5">
            Timing Preference
          </label>
          <div className="flex gap-4">
            {[
              ["regularTiming", "Regular"],
              ["occasional", "Occasional"],
              ["permanent", "Permanent"],
            ].map(([name, label]) => (
              <label key={name} className="flex items-center gap-2 text-xs">
                <input type="checkbox" name={name} checked={formData[name]} onChange={handleChange} />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Any Issue */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-[11px] font-medium mb-0.5">
            Any Issue
          </label>
          <input
            name="anyIssue"
            value={formData.anyIssue}
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2 lg:col-span-3">
          <label className="block text-[11px] font-medium mb-0.5">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="input h-20 resize-none"
          />
        </div>

        {/* Submit */}
        <div className="md:col-span-2 lg:col-span-3 flex justify-end">
          <button type="submit" className="btn-primary px-4 py-1.5 text-xs">
            Save Visitor
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyVisitorForm2;
