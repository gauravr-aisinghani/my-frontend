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

  // ONLY missing fields for final table
  const [finalForm, setFinalForm] = useState({
    authorisedName: "",
    authorisedMobileNo: "",
    qtyFinalDriver: 1,
    needTiming: "",
    otherBenefit: "",
    notes: "",
    finalApplication: "",
    finalDate: "",
  });

  const mapTransporter = (t) => ({
    visitorTransporterId: t.visitor_transporter_id,
    companyName: t.company_name,
    ownerName: t.owner_name,
    ownerMobileNo: t.owner_mobile_no,
    gaadiType: t.gaadi_type,
    loadingPlace: t.loading_place,
    unloadPlace: t.unload_place,
    monthlySalary: t.monthly_salary,
    date: t.created_at?.split("T")[0],
    status: t.status,
  });

  const loadData = async () => {
    setLoading(true);
    const data = await getAllTransportVisitors();
    setTransporters((data || []).map(mapTransporter));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openFinalModal = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    const payload = {
      visitorTransporterId: selectedRow.visitorTransporterId,
      companyName: selectedRow.companyName,
      ownerName: selectedRow.ownerName,
      ownerMobileNo: selectedRow.ownerMobileNo,
      gaadiType: selectedRow.gaadiType,
      loadingPlace: selectedRow.loadingPlace,
      unloadPlace: selectedRow.unloadPlace,
      monthlySalary: selectedRow.monthlySalary,

      authorisedName: finalForm.authorisedName,
      authorisedMobileNo: finalForm.authorisedMobileNo,
      qtyFinalDriver: finalForm.qtyFinalDriver,
      needTiming: finalForm.needTiming,
      otherBenefit: finalForm.otherBenefit,
      notes: finalForm.notes,
      finalApplication: finalForm.finalApplication,
      finalDate: finalForm.finalDate,
      approvalStatus: "PENDING",
    };

    await saveSelectedTransporter(payload);
    await deleteTransportVisitor(selectedRow.visitorTransporterId);

    setShowModal(false);
    loadData();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow">
      <h3 className="text-2xl font-semibold text-blue-700 mb-5">
        Transport Company Visitors
      </h3>

      <table className="w-full border">
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
              <td colSpan="8" className="p-5 text-center">
                Loading...
              </td>
            </tr>
          ) : (
            transporters.map((t) => (
              <tr key={t.visitorTransporterId}>
                <td className="p-2 border">{t.date}</td>
                <td className="p-2 border">{t.companyName}</td>
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
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Add to Final
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-[500px]">
            <h4 className="text-xl font-semibold mb-4">
              Final Transporter Details
            </h4>

            {Object.keys(finalForm).map((field) => (
              <input
                key={field}
                placeholder={field}
                className="w-full border p-2 mb-2"
                value={finalForm[field]}
                onChange={(e) =>
                  setFinalForm({ ...finalForm, [field]: e.target.value })
                }
              />
            ))}

            <div className="flex justify-end gap-2 mt-3">
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
