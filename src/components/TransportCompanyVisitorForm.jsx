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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      (name === "ownerMobileNo" || name === "authorisedMobileNo") &&
      value.length > 10
    ) {
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 camelCase → snake_case payload
    const payload = {
      company_name: formData.companyName,
      owner_name: formData.ownerName,
      owner_mobile_no: formData.ownerMobileNo,
      authorised_name: formData.authorisedName,
      authorised_mobile_no: formData.authorisedMobileNo,
      need_driver: formData.needDriver
        ? parseInt(formData.needDriver)
        : null,
      gaadi_type: formData.gaadiType,
      running_application: formData.runningApplication,
      loading_place: formData.loadingPlace,
      unload_place: formData.unloadPlace,
      monthly_salary: formData.monthlySalary
        ? parseFloat(formData.monthlySalary)
        : null,
      other_benefit: formData.otherBenefit,
      need_timing: formData.needTiming,
      notes: formData.notes,
      status: formData.status,
    };

    try {
      await saveTransportVisitor(payload);

      // reset form after success
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
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <h2 className="text-xl font-bold mb-4 text-green-600">
        Daily Visitors / Enquiry by Transport Company
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            name={key}
            value={formData[key]}
            onChange={handleChange}
            placeholder={key}
            className="border p-2 rounded"
          />
        ))}

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded col-span-1 md:col-span-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TransportCompanyVisitorForm;
