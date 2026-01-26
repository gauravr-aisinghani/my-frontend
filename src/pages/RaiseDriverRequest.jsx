import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import transporterDriverRequestApi from "../api/transporterDriverRequestApi";

export default function RaiseDriverRequest() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    transporter_registration_id: "",
    transporter_phone: "",

    gdc_number: "",
    vehicle_number: "",
    route: "",
    monthly_salary: "",
    remarks: "",
  });

  // 🔹 page load pe backend se transporter info laana
  useEffect(() => {
    const fetchTransporterInfo = async () => {
      try {
        const res = await transporterDriverRequestApi.getTransporterContext();
        // expected response example:
        // { transporter_registration_id: 12, user_id: "9876543210" }

        setForm((prev) => ({
          ...prev,
          transporter_registration_id: res.transporter_registration_id,
          transporter_phone: res.user_id, // 🔥 user_id → transporter_phone
        }));

        setLoading(false);
      } catch (err) {
        alert("Failed to load transporter info");
      }
    };

    fetchTransporterInfo();
  }, []);

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

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

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
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />

          <input
            name="vehicle_number"
            placeholder="Vehicle Number"
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />

          <input
            name="route"
            placeholder="Route"
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />

          <input
            name="monthly_salary"
            placeholder="Monthly Salary"
            type="number"
            className="border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />

          <textarea
            name="remarks"
            placeholder="Remarks"
            rows="2"
            className="md:col-span-3 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg border border-gray-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Save & Continue →
          </button>
        </div>
      </form>
    </div>
  );
}
