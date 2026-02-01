import React, { useEffect, useState } from "react";
import currentPostingApi from "../../api/currentPostingApi";

export default function CurrentPosting() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 5;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await currentPostingApi.getCurrentPostings();

      // ✅ MAP backend snake_case → frontend camelCase
      const mappedData = (res.data || []).map(item => ({
        assignmentId: item.assignment_id,
        driverName: item.driver_name,
        transporterName: item.transporter_name,
        assignmentStatus: item.assignment_status,
        assignedAt: item.assigned_at,
      }));

      setAllData(mappedData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(allData.length / PAGE_SIZE);

  const paginatedData = allData.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const statusColor = status => {
    switch (status) {
      case "ASSIGNED":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Current Posting</h1>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Driver</th>
              <th className="p-3 text-left">Transporter</th>
              <th className="p-3 text-left">Assigned Date</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && paginatedData.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  No current postings
                </td>
              </tr>
            )}

            {!loading &&
              paginatedData.map((item, i) => (
                <tr key={item.assignmentId || i} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.driverName}</td>
                  <td className="p-3">{item.transporterName}</td>
                  <td className="p-3">
                    {new Date(item.assignedAt).toLocaleDateString()}{" "}
                    {new Date(item.assignedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${statusColor(
                        item.assignmentStatus
                      )}`}
                    >
                      {item.assignmentStatus}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center gap-3 p-4 bg-gray-50">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="px-4 py-1 rounded bg-green-600 text-white">
            {page} / {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(page + 1)}
            className="px-4 py-1 rounded bg-gray-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
