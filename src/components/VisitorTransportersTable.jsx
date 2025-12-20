import React, { useEffect, useState } from "react";
import { getAllTransportVisitors } from "../api/transportVisitorApi";

const VisitorTransportersTable = () => {
  // Local table loader ONLY
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map backend snake_case → frontend camelCase
  const mapTransporter = (t) => ({
    visitorTransporterId: t.visitor_transporter_id,
    companyName: t.company_name,
    ownerName: t.owner_name,
    ownerMobileNo: t.owner_mobile_no,
    needDriver: t.need_driver,
    gaadiType: t.gaadi_type,
    loadingPlace: t.loading_place,
    unloadPlace: t.unload_place,
    monthlySalary: t.monthly_salary,
    status: t.status,
    date: t.created_at?.split("T")[0],
  });

  useEffect(() => {
    const fetchTransporters = async () => {
      try {
        setLoading(true);

        const data = await getAllTransportVisitors();
        console.log("Raw transporter data:", data);

        const mapped = (data || []).map(mapTransporter);
        setTransporters(mapped);
      } catch (err) {
        console.error("Error fetching transporters:", err);
        alert("Failed to load transporters");
      } finally {
        setLoading(false);
      }
    };

    fetchTransporters();
  }, []);

  return (
    <div className="bg-white p-8 rounded-2xl shadow mt-10 border border-gray-200">
      <h3 className="text-2xl font-semibold text-blue-700 mb-5">
        Transport Company Visitors
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-blue-50 text-blue-700 font-semibold">
            <tr>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Owner</th>
              <th className="p-3 border">Mobile</th>
              <th className="p-3 border">Need Driver</th>
              <th className="p-3 border">Gaadi</th>
              <th className="p-3 border">Route</th>
              <th className="p-3 border">Salary</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center p-5">
                  Loading transporters...
                </td>
              </tr>
            ) : transporters.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-gray-500 p-5">
                  No transporter visitors found.
                </td>
              </tr>
            ) : (
              transporters.map((t) => (
                <tr
                  key={t.visitorTransporterId}
                  className="hover:bg-blue-50 transition-all"
                >
                  <td className="p-3 border">{t.date}</td>
                  <td className="p-3 border font-medium">{t.companyName}</td>
                  <td className="p-3 border">{t.ownerName}</td>
                  <td className="p-3 border">{t.ownerMobileNo}</td>
                  <td className="p-3 border text-center">{t.needDriver}</td>
                  <td className="p-3 border">{t.gaadiType}</td>
                  <td className="p-3 border">
                    {t.loadingPlace} → {t.unloadPlace}
                  </td>
                  <td className="p-3 border">
                    {t.monthlySalary ? `₹${t.monthlySalary}` : "-"}
                  </td>
                  <td className="p-3 border">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        t.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {t.status}
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

export default VisitorTransportersTable;
