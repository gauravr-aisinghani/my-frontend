// src/components/TransporterVerificationTable.jsx
import React, { useEffect, useState } from "react";
import transporterVerification from "../api/transporterVerification";

const DOC_LABELS = {
  company_logo: "Company Logo",
  gst_certificate: "GST Certificate",
  id_proof: "ID Proof",
  bank_account_details: "Bank Account Details",
  address_proof: "Address Proof",
};

export default function TransporterVerificationTable() {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTransporter, setSelectedTransporter] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPendingTransporters();
  }, []);

  async function loadPendingTransporters() {
    try {
      setLoading(true);
      const list = await transporterVerificationApi.getPendingTransporters();
      setTransporters(list || []);
    } catch (err) {
      console.error("Failed to fetch pending transporters", err);
      alert("Failed to fetch pending transporters");
    } finally {
      setLoading(false);
    }
  }

  async function openTransporterDocuments(transporter) {
    try {
      const docs = await transporterVerificationApi.getTransporterDocuments(
        transporter.transporter_registration_id
      );
      setSelectedTransporter({ ...transporter, documents: docs || {} });
      setRemarks("");
    } catch (err) {
      console.error("Failed to fetch transporter documents", err);
      alert("Failed to fetch transporter documents");
    }
  }

  function closeModal() {
    setSelectedTransporter(null);
    setLightboxUrl(null);
    setRemarks("");
  }

  // Approve
  async function handleApprove() {
    if (!selectedTransporter) return;
    if (!confirm("Approve this transporter?")) return;

    try {
      setActionLoading(true);
      const payload = {
        transporterRegistrationId: selectedTransporter.transporter_registration_id,
        remarks: remarks || "Approved",
        approvedBy: "ADMIN",
      };
      await transporterVerificationApi.approveTransporter(payload);
      alert("Transporter approved.");
      setTransporters(prev =>
        prev.filter(t => t.transporter_registration_id !== selectedTransporter.transporter_registration_id)
      );
      closeModal();
    } catch (err) {
      console.error("Approve failed", err);
      alert("Approve failed");
    } finally {
      setActionLoading(false);
    }
  }

  // Reject
  async function handleReject() {
    if (!selectedTransporter) return;
    if (!confirm("Reject this transporter?")) return;

    try {
      setActionLoading(true);
      const payload = {
        transporterRegistrationId: selectedTransporter.transporter_registration_id,
        remarks: remarks || "Rejected",
      };
      await transporterVerificationApi.rejectTransporter(payload);
      alert("Transporter rejected.");
      setTransporters(prev =>
        prev.filter(t => t.transporter_registration_id !== selectedTransporter.transporter_registration_id)
      );
      closeModal();
    } catch (err) {
      console.error("Reject failed", err);
      alert("Reject failed");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow mt-6 border border-gray-200">
      <h3 className="text-2xl font-semibold text-green-700 mb-5">
        Transporter Verification
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-green-50 text-green-700 font-semibold">
            <tr>
              <th className="p-3 border">Reg ID</th>
              <th className="p-3 border">Company Name</th>
              <th className="p-3 border">Contact</th>
              <th className="p-3 border">Total Docs</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-5 text-center">Loading...</td>
              </tr>
            ) : transporters.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-500">
                  No transporters pending verification.
                </td>
              </tr>
            ) : (
              transporters.map(t => (
                <tr key={t.transporter_registration_id} className="hover:bg-green-50 transition">
                  <td className="p-3 border">{t.transporter_registration_id}</td>
                  <td className="p-3 border">{t.company_name || "-"}</td>
                  <td className="p-3 border">{t.contact_number || "-"}</td>
                  <td className="p-3 border">{t.total_docs}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => openTransporterDocuments(t)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded shadow"
                    >
                      View Documents
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedTransporter && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>

          <div className="relative bg-white rounded-2xl w-full max-w-6xl shadow-lg p-6 z-10 overflow-auto max-h-[85vh]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-green-700">
                  Documents — {selectedTransporter.company_name}
                </h3>
                <p className="text-sm text-gray-500">
                  Reg ID: {selectedTransporter.transporter_registration_id} • Contact: {selectedTransporter.contact_number}
                </p>
              </div>
              <button onClick={closeModal} className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200">Close</button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(DOC_LABELS).map(key => {
                const url = (selectedTransporter.documents && selectedTransporter.documents[key]) || null;
                return (
                  <div key={key} className="border p-3 rounded-lg bg-gray-50">
                    <div className="text-sm font-medium mb-2">{DOC_LABELS[key]}</div>
                    {url ? (
                      <img
                        src={url}
                        alt={DOC_LABELS[key]}
                        className="w-full h-28 object-cover rounded-md border cursor-pointer"
                        onClick={() => setLightboxUrl(url)}
                      />
                    ) : (
                      <div className="h-28 flex items-center justify-center text-xs text-gray-400">
                        Not uploaded
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <textarea
              placeholder="Remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full mt-6 p-3 border rounded-lg"
            />

            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-5 py-2 rounded"
              >
                {actionLoading ? "Processing..." : "Approve"}
              </button>

              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white px-5 py-2 rounded"
              >
                {actionLoading ? "Processing..." : "Reject"}
              </button>

              <button
                onClick={() => setRemarks("")}
                className="ml-auto px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Clear Remarks
              </button>
            </div>
          </div>

          {lightboxUrl && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/70" onClick={() => setLightboxUrl(null)}></div>
              <div className="relative z-10 max-w-4xl max-h-[90vh]">
                <img src={lightboxUrl} alt="preview" className="max-h-[90vh] w-auto rounded-lg" />
                <button onClick={() => setLightboxUrl(null)} className="absolute top-2 right-2 bg-white/80 px-3 py-1 rounded">Close</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
