import { useEffect, useState } from "react";
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
  // =========================
  // TABLE + DATA STATE
  // =========================
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // PAGINATION STATE (NEW)
  // =========================
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(drivers.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedDrivers = drivers.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  // =========================
  // MODAL & UI STATE
  // =========================
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    loadPendingDrivers();
  }, []);

  async function loadPendingDrivers() {
    try {
      setLoading(true);
      const list = await driverVerificationApi.getPendingDrivers();
      setDrivers(list || []);
    } catch (err) {
      console.error("Fetch pending drivers failed", err);
      alert("Failed to fetch pending drivers");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // OPEN DOCUMENT MODAL
  // =========================
  async function openDriverDocuments(driver) {
    try {
      const docs =
        await driverVerificationApi.getDriverDocuments(
          driver.driver_registration_id
        );

      setSelectedDriver({
        ...driver,
        documents: docs || {},
      });

      setRemarks("");
    } catch (err) {
      console.error("Fetch documents failed", err);
      alert("Failed to fetch driver documents");
    }
  }

  function closeModal() {
    setSelectedDriver(null);
    setLightboxUrl(null);
    setRemarks("");
  }

  // =========================
  // APPROVE DRIVER
  // =========================
  async function handleApprove() {
    if (!selectedDriver) return;
    if (!window.confirm("Approve this driver?")) return;

    try {
      setActionLoading(true);

      await driverVerificationApi.approveDriver({
        driverRegistrationId:
          selectedDriver.driver_registration_id,
        remarks: remarks || "Approved",
        approvedBy: "ADMIN",
      });

      setDrivers((prev) =>
        prev.filter(
          (d) =>
            d.driver_registration_id !==
            selectedDriver.driver_registration_id
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

  // =========================
  // REJECT DRIVER
  // =========================
  async function handleReject() {
    if (!selectedDriver) return;
    if (!window.confirm("Reject this driver?")) return;

    try {
      setActionLoading(true);

      await driverVerificationApi.rejectDriver({
        driverRegistrationId:
          selectedDriver.driver_registration_id,
        remarks: remarks || "Rejected",
      });

      setDrivers((prev) =>
        prev.filter(
          (d) =>
            d.driver_registration_id !==
            selectedDriver.driver_registration_id
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

  // =========================
  // PAGINATION HANDLERS
  // =========================
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  function nextPage() {
    goToPage(currentPage + 1);
  }

  function prevPage() {
    goToPage(currentPage - 1);
  }

  // JSX RETURN 👉 NEXT MESSAGE ME
  return (
  <div className="p-6 space-y-6">
    {/* ================= HEADER ================= */}
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-gray-800">
        Driver Verification
      </h2>
      <span className="text-sm text-gray-500">
        Total Pending: {drivers.length}
      </span>
    </div>

    {/* ================= TABLE ================= */}
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr className="text-left text-sm text-gray-600">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Driver Name</th>
            <th className="px-4 py-3">Mobile</th>
            <th className="px-4 py-3">Village</th>
            <th className="px-4 py-3">State</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="py-10 text-center text-gray-500">
                Loading...
              </td>
            </tr>
          ) : paginatedDrivers.length === 0 ? (
            <tr>
              <td colSpan="6" className="py-10 text-center text-gray-500">
                No pending drivers
              </td>
            </tr>
          ) : (
            paginatedDrivers.map((driver, index) => (
              <tr
                key={driver.driver_registration_id}
                className="border-t text-sm hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  {startIndex + index + 1}
                </td>
                <td className="px-4 py-3 font-medium">
                  {driver.driver_name}
                </td>
                <td className="px-4 py-3">
                  {driver.mobile_number}
                </td>
                <td className="px-4 py-3">
                  {driver.village_name}
                </td>
                <td className="px-4 py-3">
                  {driver.state}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => openDriverDocuments(driver)}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs hover:bg-blue-700"
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

    {/* ================= PAGINATION ================= */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center gap-2 pt-2">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => goToPage(i + 1)}
            className={`px-3 py-1 rounded-lg text-sm border ${
              currentPage === i + 1
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    )}

    {/* ================= MODAL ================= */}
    {selectedDriver && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-[90%] max-w-5xl rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">
              Driver Documents
            </h3>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto">
            {Object.entries(DOC_LABELS).map(([key, label]) => {
              const url = selectedDriver.documents?.[key];
              if (!url) return null;

              return (
                <div
                  key={key}
                  className="border rounded-xl p-3 space-y-2"
                >
                  <p className="text-xs font-medium text-gray-600">
                    {label}
                  </p>
                  <img
                    src={url}
                    alt={label}
                    onClick={() => setLightboxUrl(url)}
                    className="h-40 w-full object-cover rounded-lg cursor-pointer hover:opacity-90"
                  />
                </div>
              );
            })}
          </div>

          {/* Remarks */}
          <div className="px-6 pb-4">
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Remarks (optional)"
              className="w-full border rounded-lg p-2 text-sm"
              rows={3}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t">
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    )}

    {/* ================= IMAGE LIGHTBOX ================= */}
    {lightboxUrl && (
      <div
        onClick={() => setLightboxUrl(null)}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]"
      >
        <img
          src={lightboxUrl}
          alt="Preview"
          className="max-h-[90%] max-w-[90%] rounded-xl"
        />
      </div>
    )}
  </div>
);

}
