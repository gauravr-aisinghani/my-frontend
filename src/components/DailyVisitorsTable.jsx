import React, { useEffect, useState } from "react";
import dailyVisitorsApi2 from "../api/dailyVisitorApi2";

const DailyVisitorTable = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const mapVisitor = (v) => ({
    visitorDriverId: v.visitor_driver_id,
    driverName: v.driver_name,
    birthPlace: v.birth_place,
    mobileNo: v.mobile_no,
    preferredVehicle: v.preferred_vehicle || v.gaadi_driven_in_past,
    date: v.created_at?.split("T")[0],
    time: v.created_at?.split("T")[1]?.substring(0, 5),
  });

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const data = await dailyVisitorsApi2.getVisitors();
        setVisitors((data || []).map(mapVisitor));
      } catch {
        alert("Failed to fetch visitors");
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  const handleAddToFinal = async (v) => {
    try {
      await dailyVisitorsApi2.addToSelected({
        visitor_driver_id: v.visitorDriverId,
        driver_name: v.driverName,
        birth_place: v.birthPlace,
        mobile_no: v.mobileNo,
        preferred_vehicle: v.preferredVehicle,
        date: v.date,
        time: v.time,
        selected_date: `${v.date}T${v.time}:00`,
        approve_for: "",
        assign: "",
        approved_for_assign: null,
        assigned_status: null,
        selection_notes: null,
      });

      setVisitors(list =>
        list.filter(x => x.visitorDriverId !== v.visitorDriverId)
      );
    } catch {
      alert("Failed to add to final");
    }
  };

  // pagination logic
  const totalPages = Math.max(1, Math.ceil(visitors.length / rowsPerPage));
  const start = (currentPage - 1) * rowsPerPage;
  const currentRows = visitors.slice(start, start + rowsPerPage);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-xl shadow border p-4">

        <h2 className="text-lg font-semibold text-green-700 mb-4">
          Visitors List
        </h2>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Time</th>
                <th className="p-2 border">Driver</th>
                <th className="p-2 border">Birth Place</th>
                <th className="p-2 border">Mobile</th>
                <th className="p-2 border">Vehicle</th>
                <th className="p-2 border text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : currentRows.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No visitors found
                  </td>
                </tr>
              ) : (
                currentRows.map((v, i) => (
                  <tr key={v.visitorDriverId} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="p-2 border">{v.date}</td>
                    <td className="p-2 border">{v.time}</td>
                    <td className="p-2 border font-medium">{v.driverName}</td>
                    <td className="p-2 border">{v.birthPlace}</td>
                    <td className="p-2 border">{v.mobileNo}</td>
                    <td className="p-2 border">{v.preferredVehicle}</td>
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => handleAddToFinal(v)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md"
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

        {/* Pagination – ALWAYS VISIBLE */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
};

export default DailyVisitorTable;
