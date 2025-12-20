import React, { useEffect, useState } from "react";
import {
  getAllTransportVisitors,
  deleteTransportVisitor,
} from "../api/transportVisitorApi";
import { saveSelectedTransporter } from "../api/selectedTransporterApi";

const VisitorTransportersTable = () => {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // ONLY fields that DO NOT exist in visitor table
  const [finalForm, setFinalForm] = useState({
    qtyFinalDriver: 1,
    finalApplication: "",
    finalDate: "",
  });

  // Map DB → frontend
  const mapTransporter = (t) => ({
    visitorTransporterId: t.visitor_transporter_id,

    companyName: t.company_name,
    ownerName: t.owner_name,
    ownerMobileNo: t.owner_mobile_no,

    authorisedName: t.authorised_name,
    authorisedMobileNo: t.authorised_mobile_no,

    gaadiType: t.gaadi_type,
    loadingPlace: t.loading_place,
    unloadPlace: t.unload_place,
    monthlySalary: t.monthly_salary,

    otherBenefit: t.other_benefit,
    needTiming: t.need_timing,
    notes: t.notes,

    date: t.created_at?.split("T")[0],
    status: t.status,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllTransportVisitors();
      setTransporters((data || []).map(mapTransporter));
    } catch (err) {
      console.error(err);
      alert("Failed to load transport visitors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openFinalModal = (row) => {
    setSelectedRow(row);
    setFinalForm({
      qtyFinalDriver: 1,
      finalApplication: "",
      finalDate: "",
    });
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    try {
      const payload = {
        visitorTransporterId: selectedRow.visitorTransporterId,

        companyName: selectedRow.companyName,
        ownerName: selectedRow.ownerName,
        ownerMobileNo: selectedRow.ownerMobileNo,

        authorisedName: selectedRow.authorisedName,
        authorisedMobileNo: selectedRow.authorisedMobileNo,

        gaadiType: selectedRow.gaadiType,
        loadingPlace: selectedRow.loadingPlace,
        unloadPlace: selectedRow.unloadPlace,
        monthlySalary: selectedRow.monthlySalary,

        otherBenefit: selectedRow.otherBenefit,
        needTiming: selectedRow.needTiming,
        notes: selectedRow.notes,

        qtyFinalDriver: finalForm.qtyFinalDriver,
        finalApplication: finalForm.finalApplication,
        finalDate: finalForm.finalDate,

        approvalStatus: "PENDING",
      };

      await saveSelectedTransporter(payload);
      await deleteTransportVisitor(selectedRow.visitorTransporterId);

      setShowModal(false);
      loadData();
      alert("Transporter moved to FINAL successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to add transporter to final");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow mt-10">
      <h3 className="text-2xl font-semibold text-blue-700 mb-5">
        Transport Company Visitors
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead className="bg-blue-50">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Company</th>
              <th className="p-2 border">Owner</th>
              <th className="p-2 border">Mobile</th>
              <th className="p-2 border">Gaadi</th>
              <th className="p-2 border">Route</th>
              <th className="p-2 border">Salary</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-5">
                  Loading transporters...
                </td>
              </tr>
            ) : transporters.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-5 text-gray-500">
                  No transporter visitors found.
                </td>
              </tr>
            ) : (
              transporters.map((t) => (
                <tr
                  key={t.visitorTransporterId}
                  className="hover:bg-blue-50 transition"
                >
                  <td className="p-2 border">{t.date}</td>
                  <td className="p-2 border font-medium">{t.companyName}</td>
                  <td className="p-2 border">{t.ownerName}</td>
                  <td className="p-2 border">{t.ownerMobileNo}</td>
                  <td className="p-2 border">{t.gaadiType}</td>
                  <td className="p-2 border">
                    {t.loadingPlace} → {t.unloadPlace}
                  </td>
                  <td className="p-2 border">₹{t.monthlySalary}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => openFinalModal(t)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                    >
                      Add to Final
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FINAL MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[420px]">
            <h4 className="text-xl font-semibold mb-4">
              Final Transporter Details
            </h4>

            <label className="block mb-2 text-sm font-medium">
              Final Driver Quantity
            </label>
            <input
              type="number"
              className="w-full border p-2 mb-3"
              value={finalForm.qtyFinalDriver}
              onChange={(e) =>
                setFinalForm({
                  ...finalForm,
                  qtyFinalDriver: e.target.value,
                })
              }
            />

            <label className="block mb-2 text-sm font-medium">
              Final Application
            </label>
            <input
              className="w-full border p-2 mb-3"
              value={finalForm.finalApplication}
              onChange={(e) =>
                setFinalForm({
                  ...finalForm,
                  finalApplication: e.target.value,
                })
              }
            />

            <label className="block mb-2 text-sm font-medium">
              Final Date
            </label>
            <input
              type="date"
              className="w-full border p-2 mb-4"
              value={finalForm.finalDate}
              onChange={(e) =>
                setFinalForm({
                  ...finalForm,
                  finalDate: e.target.value,
                })
              }
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                className="px-4 py-1 bg-blue-600 text-white rounded"
              >
                Save Final
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorTransportersTable;
