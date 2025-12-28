import React, { useEffect, useState } from "react";
import { getAllSelectedTransporters } from "../api/selectedTransporterApi";

const SelectedTransportersTable = () => {
  const [selectedList, setSelectedList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===== PAGINATION STATE =====
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Map DB snake_case → UI camelCase
  const mapSelected = (t) => ({
    id: t.selected_transporter_id,
    finalDate: t.final_date,
    companyName: t.company_name,
    ownerName: t.owner_name,
    ownerMobileNo: t.owner_mobile_no,
    gaadiType: t.gaadi_type,
    loadingPlace: t.loading_place,
    unloadPlace: t.unload_place,
    qtyFinalDriver: t.qty_final_driver,
    monthlySalary: t.monthly_salary,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllSelectedTransporters();
      setSelectedList((data || []).map(mapSelected));
      setCurrentPage(1);
    } catch (err) {
      alert("Failed to load selected transporters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ===== PAGINATION LOGIC =====
  const totalPages = Math.ceil(selectedList.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = selectedList.slice(
    startIndex,
    startIndex + pageSize
  );

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto">
      <h3 className="text-2xl font-semibold text-green-700 mb-5">
        Selected Transporters (Final)
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-green-50 text-green-700 font-semibold">
            <tr>
              <th className="p-3 border">Final Date</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Owner</th>
              <th className="p-3 border">Mobile</th>
              <th className="p-3 border">Gaadi</th>
              <th className="p-3 border">Route</th>
              <th className="p-3 border text-center">Qty</th>
              <th className="p-3 border">Salary</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center p-5">
                  Loading selected transporters...
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-5 text-gray-500">
                  No selected transporters found.
                </td>
              </tr>
            ) : (
              currentData.map((t) => (
                <tr key={t.id} className="hover:bg-green-50">
                  <td className="p-3 border">{t.finalDate}</td>
                  <td className="p-3 border font-medium">
                    {t.companyName}
                  </td>
                  <td className="p-3 border">{t.ownerName}</td>
                  <td className="p-3 border">{t.ownerMobileNo}</td>
                  <td className="p-3 border">{t.gaadiType}</td>
                  <td className="p-3 border">
                    {t.loadingPlace} → {t.unloadPlace}
                  </td>
                  <td className="p-3 border text-center">
                    {t.qtyFinalDriver}
                  </td>
                  <td className="p-3 border">
                    {t.monthlySalary ? `₹${t.monthlySalary}` : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p)}
              className={`px-3 py-1 border rounded ${
                currentPage === p
                  ? "bg-green-600 text-white border-green-600"
                  : "hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SelectedTransportersTable;
