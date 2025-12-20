import React, { useEffect, useState } from "react";
import { getAllSelectedTransporters } from "../api/selectedTransporterApi";

const SelectedTransportersTable = () => {
  const [selectedList, setSelectedList] = useState([]);
  const [loading, setLoading] = useState(true);

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
    approvalStatus: t.approval_status,
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await getAllSelectedTransporters();
      setSelectedList((data || []).map(mapSelected));
    } catch (err) {
      alert("Failed to load selected transporters");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow mt-10 border border-gray-200">
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
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Salary</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center p-5">
                  Loading selected transporters...
                </td>
              </tr>
            ) : selectedList.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-5 text-gray-500">
                  No selected transporters found.
                </td>
              </tr>
            ) : (
              selectedList.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-green-50 transition-all"
                >
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
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.approvalStatus === "APPROVED"
                          ? "bg-green-100 text-green-700"
                          : t.approvalStatus === "REJECTED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {t.approvalStatus}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelectedTransportersTable;
