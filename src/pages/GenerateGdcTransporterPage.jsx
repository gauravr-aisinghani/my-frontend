import React, { useState, useEffect } from "react";
import axios from "axios";
import generateGdcTransporterApi from "../api/generateGdcTransporterApi";

export default function GenerateGdcTransporterPage() {
  const [approvedTransporters, setApprovedTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [adminName, setAdminName] = useState("");

  const [form, setForm] = useState({
    transporterRegistrationId: "",
    remarks: "",
  });

  const [result, setResult] = useState(null);

  useEffect(() => {
    loadApprovedTransporters();
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
      console.error(err);
    }
  };

  const loadApprovedTransporters = async () => {
    try {
      const data = await generateGdcTransporterApi.getApprovedTransporters();
      setApprovedTransporters(data);
    } catch (err) {
      alert("Failed to fetch approved transporters");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (t) => {
    setForm({
      transporterRegistrationId: t.transporterRegistrationId,
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
      // ✅ backend expects snake_case
      const payload = {
        transporter_registration_id: form.transporterRegistrationId,
        final_approved_by: adminName,
        remarks: form.remarks,
      };

      const res = await generateGdcTransporterApi.generateGdc(payload);
      setResult(res);

      alert("Transporter GDC Generated Successfully!");
      setModalOpen(false);
      loadApprovedTransporters();
    } catch (err) {
      alert("Failed to generate Transporter GDC");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Generate Transporter GDC</h2>

      {loading ? (
        <p>Loading...</p>
      ) : approvedTransporters.length === 0 ? (
        <p>No approved transporters found.</p>
      ) : (
        <table className="w-full border bg-white shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">Company Name</th>
              <th className="p-3 border">Owner Name</th>
              <th className="p-3 border">Owner Mobile</th>
              <th className="p-3 border">Verified At</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {approvedTransporters.map((t) => (
              <tr key={t.transporterRegistrationId}>
                <td className="p-3 border">{t.companyName}</td>
                <td className="p-3 border">{t.ownerName}</td>
                <td className="p-3 border">{t.ownerMobile}</td>
                <td className="p-3 border">
                  {new Date(t.verifiedAt).toLocaleString()}
                </td>
                <td className="p-3 border">
                  <button
                    onClick={() => openModal(t)}
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
            <h3 className="text-lg font-bold mb-4">
              Generate Transporter GDC
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                disabled
                value={form.transporterRegistrationId}
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

      {/* Result */}
      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="font-bold mb-2">Generated GDC Details</h3>
          <p><strong>GDC Number:</strong> {result.gdc_registration_number}</p>
          <p><strong>ID Card URL:</strong> {result.id_card_url}</p>
          <p><strong>Message:</strong> {result.message}</p>
        </div>
      )}
    </div>
  );
}
