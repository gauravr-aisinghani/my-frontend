import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import transporterDriverRequestApi from "../api/transporterDriverRequestApi";
export default function RaiseDriverRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    gdc_number: "",
    vehicle_number: "",
    route: "",
    monthly_salary: "",
    remarks: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await transporterDriverRequestApi.raiseRequest(form);
      alert("Driver request raised successfully");
      navigate("/transporter/dashboard");
    } catch (err) {
      alert("Failed to raise request");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-lg"
      >
        <h2 className="text-xl font-semibold mb-4">
          Raise Driver Requirement
        </h2>

        <input
          name="gdc_number"
          placeholder="GDC Number"
          className="input"
          onChange={handleChange}
        />

        <input
          name="vehicle_number"
          placeholder="Vehicle Number"
          className="input"
          onChange={handleChange}
        />

        <input
          name="route"
          placeholder="Route"
          className="input"
          onChange={handleChange}
        />

        <input
          name="monthly_salary"
          placeholder="Monthly Salary"
          type="number"
          className="input"
          onChange={handleChange}
        />

        <textarea
          name="remarks"
          placeholder="Remarks (optional)"
          className="input"
          onChange={handleChange}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}
