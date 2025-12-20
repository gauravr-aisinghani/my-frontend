// src/components/SelectedDriversTable.jsx
import React, { useEffect, useState } from "react";
import selectedDriverApi from "../api/selectedDriverApi";

const SelectedDriversTable = () => {
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const mapSelected = (d) => ({
    selectedDriverId: d.selected_driver_id,
    driverName: d.driver_name,
    birthPlace: d.birth_place,
    mobileNo: d.mobile_no,
    grade: d.grade,
    preferredVehicle: d.preferred_vehicle,
    createdAt: d.created_at,
  });

  useEffect(() => {
    const fetchSelectedDrivers = async () => {
      try {
        setLoading(true);
        const data = await selectedDriverApi.getAllSelectedDrivers();
        const mapped = (data || []).map(mapSelected);
        setSelectedDrivers(mapped);
      } catch (err) {
        console.error("Error fetching selected drivers", err);
        alert("Failed to fetch selected drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchSelectedDrivers();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 mt-8">
      <h3 className="text-2xl font-bold text-green-700 mb-6">
        Final Selected Drivers
      </h3>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full table-auto text-left">
          <thead className="bg-green-50 text-green-700 sticky top-0 z-10">
            <tr className="text-sm uppercase tracking-wide">
              <th className="p-3 border">Driver Name</th>
              <th className="p-3 border">Birth Place</th>
              <th className="p-3 border">Mobile</th>
              <th className="p-3 border">Grade</th>
              <th className="p-3 border">Preferred Vehicle</th>
              <th className="p-3 border">Created At</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-6">
                  Loading selected drivers...
                </td>
              </tr>
            ) : selectedDrivers.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-6 text-gray-500 text-lg">
                  No selected drivers yet.
                </td>
              </tr>
            ) : (
              selectedDrivers.map((d, idx) => (
                <tr
                  key={d.selectedDriverId || idx}
                  className={`border-t hover:bg-green-50 transition-all ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 border font-semibold text-gray-900">
                    {d.driverName}
                  </td>
                  <td className="p-3 border">{d.birthPlace}</td>
                  <td className="p-3 border">{d.mobileNo}</td>
                  <td className="p-3 border">{d.grade}</td>
                  <td className="p-3 border">{d.preferredVehicle}</td>
                  <td className="p-3 border">
                    {d.createdAt ? d.createdAt.substring(0, 10) : "-"}
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

export default SelectedDriversTable;
