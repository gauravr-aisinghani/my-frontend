import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import transporterDriverRequestApi from "../api/transporterDriverRequestApi";

export default function RaiseDriverRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    transporter_registration_id: "",
    transporter_phone: "",

    gdc_number: "",
    vehicle_number: "",
    route: "",
    monthly_salary: "",
    remarks: "",
  });

  // 🔹 Page load pe token se values set karo
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);

    setForm((prev) => ({
      ...prev,
      transporter_registration_id: decoded.transporter_registration_id,
      transporter_phone: decoded.sub, // 🔥 user_id → transporter_phone
    }));
  }, [navigate]);

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
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl rounded-xl shadow p-8"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Raise Driver Requirement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            name="gdc_number"
            placeholder="GDC Number"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />

          <input
            name="vehicle_number"
            placeholder="Vehicle Number"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />

          <input
            name="route"
            placeholder="Route"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />

          <input
            name="monthly_salary"
            type="number"
            placeholder="Monthly Salary"
            className="border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />

          <textarea
            name="remarks"
            placeholder="Remarks"
            rows="2"
            className="md:col-span-3 border rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded-lg"
          >
            Save & Continue →
          </button>
        </div>
      </form>
    </div>
  );
}
