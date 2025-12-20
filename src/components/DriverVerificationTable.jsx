// src/components/DriverVerificationTable.jsx
// UPDATED: Sends driverRegistrationId (not driverVerificationId)

import React, { useEffect, useState } from "react";
import driverVerificationApi from "../api/driverVerificationApi";

const DOC_LABELS = {
  driver_selfie: "Driver Selfie",
  home_photo: "Home Photo",
  sarpanch_letter: "Sarpanch Letter",
  bank_account_details: "Bank Account Details",
  passbook_photo: "Passbook Photo",
  aadhar_photo: "Aadhar Card",
  pan_photo: "PAN Card",
  licence_photo: "Licence Photo",
  payment_proof_upi: "UPI Payment Screenshot",
  driver_signature: "Driver Signature",
};

export default function DriverVerificationTable() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedDriver, setSelectedDriver] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadPendingDrivers();
  }, []);

  async function loadPendingDrivers() {
    try {
      setLoading(true);
      const list = await driverVerificationApi.getPendingDrivers();
      setDrivers(list || []);
    } catch (err) {
      console.error("Failed to fetch pending drivers", err);
      alert("Failed to fetch pending drivers");
    } finally {
      setLoading(false);
    }
  }

  async function openDriverDocuments(driver) {
    try {
      const docs = await driverVerificationApi.getDriverDocuments(
        driver.driver_registration_id
      );
      setSelectedDriver({ ...driver, documents: docs || {} });
      setRemarks("");
    } catch (err) {
      console.error("Failed to fetch driver documents", err);
      alert("Failed to fetch driver documents");
    }
  }

  function closeModal() {
    setSelectedDriver(null);
    setLightboxUrl(null);
    setRemarks("");
  }

  // APPROVE
  async function handleApprove() {
    if (!selectedDriver) return;
    if (!confirm("Approve this driver?")) return;

    try {
      setActionLoading(true);

      const payload = {
        driverRegistrationId: selectedDriver.driver_registration_id, // ✅ Correct key
        remarks: remarks || "Approved",
        approvedBy: "ADMIN",
      };

      await driverVerificationApi.approveDriver(payload);

      alert("Driver approved.");
      setDrivers((prev) =>
        prev.filter(
          (d) => d.driver_registration_id !== selectedDriver.driver_registration_id
        )
      );

      closeModal();
    } catch (err) {
      console.error("Approve failed", err);
      alert("Approve failed");
    } finally {
      setActionLoading(false);
    }
  }

  // REJECT
  async function handleReject() {
    if (!selectedDriver) return;
    if (!confirm("Reject this driver?")) return;

    try {
      setActionLoading(true);

      const payload = {
        driverRegistrationId: selectedDriver.driver_registration_id, // ✅ Correct key
        remarks: remarks || "Rejected",
      };

      await driverVerificationApi.rejectDriver(payload);

      alert("Driver rejected.");
      setDrivers((prev) =>
        prev.filter(
          (d) => d.driver_registration_id !== selectedDriver.driver_registration_id
        )
      );

      closeModal();
    } catch (err) {
      console.error("Reject failed", err);
      alert("Reject failed");
    } finally {
      setActionLoading(false);
    }
  }

  function countDocsFromRow(row) {
    let count = 0;
    Object.keys(DOC_LABELS).forEach((k) => {
      if (row[k]) count += 1;
      if (!row[k] && row.documents && row.documents[k]) count += 1;
    });
    return count;
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow mt-6 border border-gray-200">
      <h3 className="text-2xl font-semibold text-green-700 mb-5">
        Driver Verification
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-green-50 text-green-700 font-semibold">
            <tr>
              <th className="p-3 border">Reg ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Mobile</th>
              <th className="p-3 border">Total Docs</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="p-5 text-center">
                  Loading...
                </td>
              </tr>
            ) : drivers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-5 text-center text-gray-500">
                  No drivers pending verification.
                </td>
              </tr>
            ) : (
              drivers.map((d) => (
                <tr
                  key={d.driver_registration_id}
                  className="hover:bg-green-50 transition"
                >
                  <td className="p-3 border">{d.driver_registration_id}</td>
                  <td className="p-3 border">{d.full_name || d.name || "-"}</td>
                  <td className="p-3 border">{d.mobile_no || d.mobile || "-"}</td>
                  <td className="p-3 border">{d.total_docs}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => openDriverDocuments(d)}
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

      {selectedDriver && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
          ></div>

          <div className="relative bg-white rounded-2xl w-full max-w-6xl shadow-lg p-6 z-10 overflow-auto max-h-[85vh]">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold text-green-700">
                  Documents — {selectedDriver.full_name || selectedDriver.name}
                </h3>
                <p className="text-sm text-gray-500">
                  Reg ID: {selectedDriver.driver_registration_id} • Mobile:{" "}
                  {selectedDriver.mobile_no || selectedDriver.mobile}
                </p>
              </div>

              <button
                onClick={closeModal}
                className="px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
              >
                Close
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Personal Documents
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["driver_selfie", "home_photo", "aadhar_photo", "pan_photo", "licence_photo"].map(
                    (key) => {
                      const url =
                        (selectedDriver.documents &&
                          selectedDriver.documents[key]) ||
                        selectedDriver[key] ||
                        null;
                      return (
                        <div key={key} className="border p-3 rounded-lg bg-gray-50">
                          <div className="text-sm font-medium mb-2">
                            {DOC_LABELS[key]}
                          </div>
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
                    }
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-3">
                  Verification Documents
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {["passbook_photo", "bank_account_details", "sarpanch_letter", "payment_proof_upi", "driver_signature"].map(
                    (key) => {
                      const url =
                        (selectedDriver.documents &&
                          selectedDriver.documents[key]) ||
                        selectedDriver[key] ||
                        null;
                      return (
                        <div key={key} className="border p-3 rounded-lg bg-gray-50">
                          <div className="text-sm font-medium mb-2">
                            {DOC_LABELS[key]}
                          </div>
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
                    }
                  )}
                </div>
              </div>
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
              <div
                className="absolute inset-0 bg-black/70"
                onClick={() => setLightboxUrl(null)}
              ></div>
              <div className="relative z-10 max-w-4xl max-h-[90vh]">
                <img
                  src={lightboxUrl}
                  alt="preview"
                  className="max-h-[90vh] w-auto rounded-lg"
                />
                <button
                  onClick={() => setLightboxUrl(null)}
                  className="absolute top-2 right-2 bg-white/80 px-3 py-1 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}