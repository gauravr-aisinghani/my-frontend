import React, { useEffect, useState } from "react";
import idealDriversApi from "../api/idealDriversApi";

export default function IdealDrivers() {
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
      const res = await idealDriversApi.getIdealDrivers();

      // backend → frontend mapping
      const mappedData = (res.data || []).map(item => ({
        driverRegistrationId: item.driverRegistrationId,
        driverName: item.driverName,
        mobileNumber: item.mobileNumber,
        gdcNumber: item.gdcNumber,
        paymentDate: item.paymentDate,
        idleSince: item.idleSince,
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

  const daysIdle = idleSince => {
    if (!idleSince) return "-";
    const diff =
      (new Date() - new Date(idleSince)) / (1000 * 60 * 60 * 24);
    return Math.floor(diff);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Ideal Drivers</h1>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Driver</th>
              <th className="p-3 text-left">Mobile</th>
              <th className="p-3 text-left">GDC Number</th>
              <th className="p-3 text-left">Payment Date</th>
              <th className="p-3 text-left">Idle Since</th>
              <th className="p-3 text-left">Days Idle</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && paginatedData.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center">
                  No ideal drivers found
                </td>
              </tr>
            )}

            {!loading &&
              paginatedData.map((item, i) => (
                <tr
                  key={item.driverRegistrationId || i}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 font-medium">{item.driverName}</td>
                  <td className="p-3">{item.mobileNumber}</td>
                  <td className="p-3">{item.gdcNumber}</td>
                  <td className="p-3">
                    {new Date(item.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {new Date(item.idleSince).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <span className="px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                      {daysIdle(item.idleSince)} days
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
