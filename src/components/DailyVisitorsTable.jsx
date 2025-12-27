import React, { useEffect, useState } from "react";
import dailyVisitorsApi2 from "../api/dailyVisitorApi2";

const DailyVisitorTable = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2; // 🔥 testing ke liye 2

  const mapVisitor = (v) => ({
    visitorDriverId: v.visitor_driver_id,
    driverName: v.driver_name,
    birthPlace: v.birth_place,
    mobileNo: v.mobile_no,
    gaadiDrivenInPast: v.gaadi_driven_in_past,
    preferredVehicle: v.preferred_vehicle,
    date: v.created_at?.split("T")[0],
    time: v.created_at?.split("T")[1]?.substring(0, 5),
  });

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const data = await dailyVisitorsApi2.getVisitors();
        setVisitors((data || []).map(mapVisitor));
      } catch (err) {
        alert("Failed to fetch visitors");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  // add to final
  const handleAddToFinal = async (v) => {
    try {
      await dailyVisitorsApi2.addToSelected({
        visitor_driver_id: v.visitorDriverId,
        driver_name: v.driverName,
        birth_place: v.birthPlace,
        mobile_no: v.mobileNo,
        preferred_vehicle: v.preferredVehicle || v.gaadiDrivenInPast,
        date: v.date,
        time: v.time,
        selected_date: `${v.date}T${v.time}:00`,
        approve_for: "",
        assign: "",
        approved_for_assign: null,
        assigned_status: null,
        selection_notes: null,
      });

      setVisitors(visitors.filter(x => x.visitorDriverId !== v.visitorDriverId));
    } catch {
      alert("Failed to add to final drivers");
    }
  };

  // pagination logic
  const totalPages = Math.ceil(visitors.length / rowsPerPage);
  const start = (currentPage - 1) * rowsPerPage;
  const currentRows = visitors.slice(start, start + rowsPerPage);

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Visitors List
        </h2>

        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Time</th>
                <th className="p-3 border">Driver Name</th>
                <th className="p-3 border">Birth Place</th>
                <th className="p-3 border">Mobile</th>
                <th className="p-3 border">Vehicle</th>
                <th className="p-3 border text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-500">
                    No visitors found
                  </td>
                </tr>
              ) : (
                currentRows.map((v, i) => (
                  <tr
                    key={v.visitorDriverId}
                    className={i % 2 ? "bg-gray-50" : ""}
                  >
                    <td className="p-3 border">{v.date}</td>
                    <td className="p-3 border">{v.time}</td>
                    <td className="p-3 border font-medium">{v.driverName}</td>
                    <td className="p-3 border">{v.birthPlace}</td>
                    <td className="p-3 border">{v.mobileNo}</td>
                    <td className="p-3 border">
                      {v.preferredVehicle || v.gaadiDrivenInPast}
                    </td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleAddToFinal(v)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 border rounded ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default DailyVisitorTable;
