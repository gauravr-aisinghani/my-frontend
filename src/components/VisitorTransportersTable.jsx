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
    qty_final_driver: 1,
    final_application: "",
    final_date: "",
  });

  // Map DB → frontend
  const mapTransporter = (t) => ({
    visitorTransporterId: t.visitor_transporter_id,

    company_name: t.company_name,
    owner_name: t.owner_name,
    owner_mobile_no: t.owner_mobile_no,

    authorised_name: t.authorised_name,
    authorised_mobile_no: t.authorised_mobile_no,

    gaadi_type: t.gaadi_type,
    loading_place: t.loading_place,
    unload_place: t.unload_place,
    monthly_salary: t.monthly_salary,

    other_benefit: t.other_benefit,
    need_timing: t.need_timing,
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
      qty_final_driver: 1,
      final_application: "",
      final_date: "",
    });
    setShowModal(true);
  };

  const handleFinalSubmit = async () => {
    try {
      const payload = {
        visitor_transporter_id: selectedRow.visitorTransporterId,

        company_name: selectedRow.company_name,
        owner_name: selectedRow.owner_name,
        owner_mobile_no: selectedRow.owner_mobile_no,

        authorised_name: selectedRow.authorised_name,
        authorised_mobile_no: selectedRow.authorised_mobile_no,

        gaadi_type: selectedRow.gaadi_type,
        loading_place: selectedRow.loading_place,
        unload_place: selectedRow.unload_place,
        monthly_salary: selectedRow.monthly_salary,

        other_benefit: selectedRow.other_benefit,
        need_timing: selectedRow.need_timing,
        notes: selectedRow.notes,

        qty_final_driver: finalForm.qty_final_driver,
        final_application: finalForm.final_application,
        final_date: finalForm.final_date,

        approval_status: "PENDING",
      };

      console.log("FINAL PAYLOAD 👉", payload);

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
                  <td className="p-2 border font-medium">
                    {t.company_name}
                  </td>
                  <td className="p-2 border">{t.owner_name}</td>
                  <td className="p-2 border">{t.owner_mobile_no}</td>
                  <td className="p-2 border">{t.gaadi_type}</td>
                  <td className="p-2 border">
                    {t.loading_place} → {t.unload_place}
                  </td>
                  <td className="p-2 border">₹{t.monthly_salary}</td>
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
              value={finalForm.qty_final_driver}
              onChange={(e) =>
                setFinalForm({
                  ...finalForm,
                  qty_final_driver: e.target.value,
                })
              }
            />

            <label className="block mb-2 text-sm font-medium">
              Final Application
            </label>
            <input
              className="w-full border p-2 mb-3"
              value={finalForm.final_application}
              onChange={(e) =>
                setFinalForm({
                  ...finalForm,
                  final_application: e.target.value,
                })
              }
            />

            <label className="block mb-2 text-sm font-medium">
              Final Date
            </label>
            <input
              type="date"
              className="w-full border p-2 mb-4"
              value={finalForm.final_date}
              onChange={(e) =>
                setFinalForm({
                  ...finalForm,
                  final_date: e.target.value,
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
