// src/components/DailyVisitorTable.jsx
import React, { useEffect, useState } from "react";
import dailyVisitorsApi2 from "../api/dailyVisitorApi2";

const DailyVisitorTable = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Map backend snake_case → frontend camelCase
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

        console.log("Raw backend data:", data);

        const mapped = (data || []).map(mapVisitor);

        console.log("Mapped frontend data:", mapped);

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

  // -----------------------------------------
  // ADD TO FINAL (FIXED SNAKE_CASE PAYLOAD)
  // -----------------------------------------
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

  approve_for: "",       // 🔥 REQUIRED
  assign: "",            // 🔥 REQUIRED

  approved_for_assign: null,
  assigned_status: null,
  selection_notes: null,
};


      console.log("Payload to backend (snake_case):", selectedData);

      const response = await dailyVisitorsApi2.addToSelected(selectedData);
      console.log("Backend response:", response);

      // Remove from table after success
      setVisitors(visitors.filter((item) => item.visitorDriverId !== v.visitorDriverId));

      alert("Successfully moved to final drivers!");
    } catch (err) {
      console.error("Error adding to final drivers:", err);
      alert("Failed to add to final drivers");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow mt-10 border border-gray-200">
      <h3 className="text-2xl font-semibold text-green-700 mb-5">Visitors List</h3>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead className="bg-green-50 text-green-700 font-semibold">
            <tr>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Time</th>
              <th className="p-3 border">Driver Name</th>
              <th className="p-3 border">Birth Place</th>
              <th className="p-3 border">Mobile</th>
              <th className="p-3 border">Vehicle</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center p-5">Loading visitors...</td>
              </tr>
            ) : visitors.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 p-5">
                  No visitors found.
                </td>
              </tr>
            ) : (
              visitors.map((v) => (
                <tr
                  key={v.visitorDriverId}
                  className="hover:bg-green-50 transition-all"
                >
                  <td className="p-3 border">{v.date}</td>
                  <td className="p-3 border">{v.time}</td>
                  <td className="p-3 border">{v.driverName}</td>
                  <td className="p-3 border">{v.birthPlace}</td>
                  <td className="p-3 border">{v.mobileNo}</td>
                  <td className="p-3 border">
                    {v.preferredVehicle || v.gaadiDrivenInPast}
                  </td>

                  <td className="p-3 border text-center">
                    <button
                      onClick={() => handleAddToFinal(v)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md transition active:scale-95"
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
    </div>
  );
};

export default DailyVisitorTable;
