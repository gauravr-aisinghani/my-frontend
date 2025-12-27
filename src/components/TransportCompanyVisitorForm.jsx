import React, { useState } from "react";
import { saveTransportVisitor } from "../api/transportVisitorApi";

const TransportCompanyVisitorForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    ownerName: "",
    ownerMobileNo: "",
    authorisedName: "",
    authorisedMobileNo: "",
    needDriver: "",
    gaadiType: "",
    runningApplication: "",
    loadingPlace: "",
    unloadPlace: "",
    monthlySalary: "",
    otherBenefit: "",
    needTiming: "",
    notes: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      ["ownerMobileNo", "authorisedMobileNo"].includes(name) &&
      !/^\d*$/.test(value)
    )
      return;

    if (name === "ownerMobileNo" || name === "authorisedMobileNo") {
      if (value.length > 10) return;
    }

    if (name === "needDriver" && !/^\d*$/.test(value)) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateField = (name, value) => {
    let msg = "";

    switch (name) {
      case "companyName":
        if (!value.trim()) msg = "Company Name is required";
        break;

      case "ownerName":
        if (!value.trim()) msg = "Owner Name is required";
        break;

      case "ownerMobileNo":
        if (!value.trim()) msg = "Owner Mobile is required";
        else if (value.length !== 10) msg = "Owner Mobile must be 10 digits";
        break;

      case "authorisedName":
        if (!value.trim()) msg = "Authorised Person Name is required";
        break;

      case "authorisedMobileNo":
        if (value && value.length !== 10) msg = "Authorised Mobile must be 10 digits";
        break;

      case "needDriver":
        if (!value.trim()) msg = "Need Driver is required";
        break;

      case "gaadiType":
        if (!value.trim()) msg = "Gaadi Type is required";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: msg }));
  };

  const inputClass = (name) => `input ${errors[name] ? "border-red-500" : ""}`;

  const renderError = (name) =>
    errors[name] ? (
      <p className="text-red-500 text-[11px] mt-0.5">{errors[name]}</p>
    ) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    [
      "companyName",
      "ownerName",
      "ownerMobileNo",
      "authorisedName",
      "needDriver",
      "gaadiType",
    ].forEach((field) => validateField(field, formData[field]));

    const hasError = Object.values(errors).some((e) => e);
    if (hasError) return alert("Please fix validation errors");

    const payload = {
      company_name: formData.companyName,
      owner_name: formData.ownerName,
      owner_mobile_no: formData.ownerMobileNo,
      authorised_name: formData.authorisedName,
      authorised_mobile_no: formData.authorisedMobileNo,
      need_driver: formData.needDriver ? parseInt(formData.needDriver) : null,
      gaadi_type: formData.gaadiType,
      running_application: formData.runningApplication,
      loading_place: formData.loadingPlace,
      unload_place: formData.unloadPlace,
      monthly_salary: formData.monthlySalary ? parseFloat(formData.monthlySalary) : null,
      other_benefit: formData.otherBenefit,
      need_timing: formData.needTiming,
      notes: formData.notes,
      status: formData.status,
    };

    try {
      await saveTransportVisitor(payload);
      alert("Transport Visitor saved successfully!");

      // reset form
      setFormData({
        companyName: "",
        ownerName: "",
        ownerMobileNo: "",
        authorisedName: "",
        authorisedMobileNo: "",
        needDriver: "",
        gaadiType: "",
        runningApplication: "",
        loadingPlace: "",
        unloadPlace: "",
        monthlySalary: "",
        otherBenefit: "",
        needTiming: "",
        notes: "",
        status: "ACTIVE",
      });
      setErrors({});
    } catch (err) {
      console.error("Save failed", err);
      alert("Error saving visitor ❌");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-green-600">
        Daily Visitors / Enquiry by Transport Company
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {[
          ["companyName", "Company Name *"],
          ["ownerName", "Owner Name *"],
          ["ownerMobileNo", "Owner Mobile *"],
          ["authorisedName", "Authorised Person Name *"],
          ["authorisedMobileNo", "Authorised Mobile"],
          ["needDriver", "Need Driver *"],
          ["gaadiType", "Gaadi Type *"],
          ["runningApplication", "Running Application"],
          ["loadingPlace", "Loading Place"],
          ["unloadPlace", "Unload Place"],
          ["monthlySalary", "Monthly Salary"],
          ["otherBenefit", "Other Benefit"],
          ["needTiming", "Need Timing"],
          ["notes", "Notes"],
        ].map(([key, label]) => (
          <div key={key} className="flex flex-col">
            {key !== "notes" ? (
              <input
                name={key}
                value={formData[key]}
                onChange={handleChange}
                onBlur={(e) => validateField(key, e.target.value)}
                placeholder={label}
                className={`${inputClass(key)} border p-2 rounded`}
              />
            ) : (
              <textarea
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={label}
                className={`${inputClass(key)} border p-2 rounded h-24 resize-none`}
              />
            )}
            {renderError(key)}
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded col-span-1 md:col-span-2 lg:col-span-3"
        >
          Save Visitor
        </button>
      </form>
    </div>
  );
};

export default TransportCompanyVisitorForm;
