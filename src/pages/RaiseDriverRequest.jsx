import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import transporterDriverRequestApi from "../api/transporterDriverRequestApi";

export default function RaiseDriverRequest() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    transporterRegistrationId: "",
    transporterPhone: "",
    gdcNumber: "",

    vehicleGrade: "",
    vehicleNumber: "",
    route: "",
    monthlySalary: "",
    remarks: "",
  });

  // 🔥 load transporter context
  useEffect(() => {
    const context = JSON.parse(localStorage.getItem("user_context"));

    if (!context || context.role !== "TRANSPORTER") {
      alert("Unauthorized access");
      navigate("/login");
      return;
    }

    setForm((prev) => ({
      ...prev,
      transporterRegistrationId: context.transporter_registration_id,
      transporterPhone: context.user_id,
      gdcNumber: context.gdc_number,
    }));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    transporter_registration_id: form.transporterRegistrationId,
    transporter_phone: form.transporterPhone,
    gdc_number: form.gdcNumber,

    vehicle_grade: form.vehicleGrade,
    vehicle_number: form.vehicleNumber,
    route: form.route,
    monthly_salary: Number(form.monthlySalary),
    remarks: form.remarks,
  };

  try {
    await transporterDriverRequestApi.raiseRequest(payload);

    alert("Driver request raised successfully");
    navigate("/transporter/dashboard");
  } catch (err) {
    console.error(err);
    alert(err?.response?.data || "Failed to raise driver request");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-4xl rounded-xl shadow p-8"
      >
        <h2 className="text-2xl font-semibold mb-6">
          Raise Driver Requirement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            name="gdcNumber"
            value={form.gdcNumber}
            disabled
            className="border rounded-lg px-4 py-3 bg-gray-100"
          />

          {/* VEHICLE GRADE */}
          <select
            name="vehicleGrade"
            value={form.vehicleGrade}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-3"
          >
            <option value="">Select Vehicle Grade</option>
            <option value="LMV">LMV</option>
            <option value="HMV">HMV</option>
            <option value="MCWG">MCWG</option>
            <option value="MCWOG">MCWOG</option>
            <option value="TRANS">TRANS</option>
            <option value="TRAILER">TRAILER</option>
          </select>

          <input
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={form.vehicleNumber}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
            required
          />

          <input
            name="route"
            placeholder="Route"
            value={form.route}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
            required
          />

          <input
            name="monthlySalary"
            type="number"
            placeholder="Monthly Salary"
            value={form.monthlySalary}
            onChange={handleChange}
            className="border rounded-lg px-4 py-3"
            required
          />

          <textarea
            name="remarks"
            placeholder="Remarks (optional)"
            value={form.remarks}
            rows="2"
            onChange={handleChange}
            className="md:col-span-3 border rounded-lg px-4 py-3"
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
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
}
