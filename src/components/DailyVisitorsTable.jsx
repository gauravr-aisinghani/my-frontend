import React, { useEffect, useState } from "react";
import dailyVisitorsApi2 from "../api/dailyVisitorApi2";

const DailyVisitorTable = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Map backend → frontend
  const mapVisitor = (v) => ({
    visitorDriverId: v.visitor_driver_id,
    driverName: v.driver_name,
    location: v.location,
    birthPlace: v.birth_place,
    mobileNo: v.mobile_no,
    otherMobile: v.other_mobile,
    grade: v.grade,
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
        const mapped = (data || []).map(mapVisitor);
        setVisitors(mapped);
      } catch (err) {
        console.error("Error fetching visitors:", err);
        alert("Failed to fetch visitors");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  // -------------------------
  // ADD TO FINAL
  // -------------------------
  const handleAddToFinal = async (v) => {
    try {
      const selectedData = {
        visitor_driver_id: v.visitorDriverId,
        driver_name: v.driverName,
        birth_place: v.birthPlace,
        mobile_no: v.mobileNo,
        grade: v.grade,
        preferred_vehicle: v.preferredVehicle || v.gaadiDrivenInPast,
        date: v.date,
        time: v.time,
        selected_date: `${v.date}T${v.time}:00`,
        approve_for: "",
        assign: "",
        approved_for_assign: null,
        assigned_status: null,
        selection_notes: null,
      };

      await dailyVisitorsApi2.addToSelected(selectedData);

      setVisitors(
        visitors.filter(
          (item) => item.visitorDriverId !== v.visitorDriverId
        )
      );

      alert("Successfully moved to final drivers!");
    } catch (err) {
      console.error("Error adding to final drivers:", err);
      alert("Failed to add to final drivers");
    }
  };

  // -------------------------
  // PAGINATION LOGIC
  // -------------------------
  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = visitors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(visitors.length / rowsPerPage);

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 mt-8 p-6 md:p-8">
      <h3 className="text-2xl font-bold text-green-700 mb-6">
        Visitors List
      </h3>

      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full table-auto text-left">
          <thead className="bg-green-50 text-green-700 uppercase text-sm">
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

          <tbody className="text-gray-800">
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-6">
                  Loading visitors...
                </td>
              </tr>
            ) : currentRows.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-6 text-gray-500">
                  No visitors found.
                </td>
              </tr>
            ) : (
              currentRows.map((v, idx) => (
                <tr
                  key={v.visitorDriverId}
                  className={`border-t hover:bg-green-50 transition ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="p-3 border">{v.date}</td>
                  <td className="p-3 border">{v.time}</td>
                  <td className="p-3 border font-medium">
                    {v.driverName}
                  </td>
                  <td className="p-3 border">{v.birthPlace}</td>
                  <td className="p-3 border">{v.mobileNo}</td>
                  <td className="p-3 border">
                    {v.preferredVehicle || v.gaadiDrivenInPast}
                  </td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleAddToFinal(v)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition active:scale-95"
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
      {!loading && visitors.length > rowsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-green-100"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === page
                    ? "bg-green-600 text-white"
                    : "hover:bg-green-100"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(p + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-green-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DailyVisitorTable;
