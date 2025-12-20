import React, { useState, useEffect } from "react";
import axios from "axios";
import generateGdcApi from "../api/generateGdcApi";

export default function GenerateGdcPage() {
  const [approvedDrivers, setApprovedDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminName, setAdminName] = useState("");

  const [form, setForm] = useState({
    driverRegistrationId: "",
    verificationId: "",
    remarks: "",
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadApprovedDrivers();
    loadAdminName();
  }, []);

  const loadAdminName = async () => {
    try {
      const res = await axios.get(
        "https://my-backend-1-qxc9.onrender.com/api/auth/session-status",
        { withCredentials: true }
      );

      if (res.data?.role) setAdminName(res.data.role);
    } catch (err) {
      console.error("Session fetch error", err);
    }
  };

  const loadApprovedDrivers = async () => {
    try {
      const data = await generateGdcApi.getApprovedDrivers();
      setApprovedDrivers(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch approved drivers");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (driver) => {
    setForm({
      driverRegistrationId: driver.driverRegistrationId,
      verificationId: driver.verificationId,
      remarks: "",
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Snake_case payload for backend
      const payload = {
        driver_registration_id: form.driverRegistrationId,
        verification_id: form.verificationId,
        final_approved_by: adminName,
        remarks: form.remarks,
      };

      const res = await generateGdcApi.generateGdc(payload);
      setResult(res);

      alert("GDC Generated Successfully!");
      setModalOpen(false);
      loadApprovedDrivers();
    } catch (err) {
      alert("Failed to generate GDC");
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Generate GDC</h2>

      {loading ? (
        <p>Loading...</p>
      ) : approvedDrivers.length === 0 ? (
        <p>No approved drivers found.</p>
      ) : (
        <table className="w-full border bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Driver Name</th>
              <th className="p-3 border">Mobile</th>
              <th className="p-3 border">Village</th>
              <th className="p-3 border">Verified At</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {approvedDrivers.map((d) => (
              <tr key={d.verificationId}>
                <td className="p-3 border">{d.fullName}</td>
                <td className="p-3 border">{d.mobileNumber}</td>
                <td className="p-3 border">{d.village}</td>
                <td className="p-3 border">{d.verifiedAt}</td>

                <td className="p-3 border">
                  <button
                    onClick={() => openModal(d)}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Generate GDC
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-[400px]">
            <h3 className="text-lg font-bold mb-4">Generate GDC</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                disabled
                value={form.verificationId}
                className="w-full p-2 border rounded bg-gray-200"
              />

              <input
                disabled
                value={form.driverRegistrationId}
                className="w-full p-2 border rounded bg-gray-200"
              />

              <textarea
                name="remarks"
                placeholder="Remarks"
                value={form.remarks}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded w-full"
              >
                Generate GDC
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="font-bold mb-2">Generated GDC Details</h3>

          <p>
            <strong>GDC Number:</strong> {result.gdc_registration_number}
          </p>

          <p>
            <strong>Image URL:</strong> {result.id_card_url}
          </p>

          <p>
            <strong>Message:</strong> {result.message}
          </p>
        </div>
      )}
    </div>
  );
}
