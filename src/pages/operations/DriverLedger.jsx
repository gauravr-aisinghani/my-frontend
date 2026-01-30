import React, { useEffect, useState } from "react";
import {
  fetchDriverLedgers,
  fetchSingleDriverLedger,
} from "../../api/driverLedgerApi";

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
  >
    {children}
  </button>
);

const Input = (props) => (
  <input {...props} className="border px-3 py-2 rounded w-full" />
);

export default function DriverLedger() {
  const [drivers, setDrivers] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 8;

  // ===============================
  // LOAD ALL DRIVERS
  // ===============================
  const loadDrivers = async () => {
    const data = await fetchDriverLedgers({
      search,
      from_date: fromDate,
      to_date: toDate,
      page,
      size: perPage,
    });

    setDrivers(data.content || data);
  };

  useEffect(() => {
    loadDrivers();
  }, [page]);

  // ===============================
  // OPEN PARTICULAR DRIVER LEDGER
  // ===============================
  const openLedger = async (driver) => {
    setSelectedDriver(driver);

    const data = await fetchSingleDriverLedger(
      driver.gdc_number,
      driver.driver_id
    );

    setLedger(data.transactions || []);
  };

  // ===============================
  // SINGLE DRIVER LEDGER VIEW
  // ===============================
  if (selectedDriver) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-3">

        <Button onClick={() => setSelectedDriver(null)}>← Back</Button>

        <div className="bg-orange-300 p-2 font-semibold rounded">
          Driver : {selectedDriver.driver_name} | WTL :{" "}
          {selectedDriver.driver_code}
        </div>

        <table className="w-full text-sm bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th>DATE</th>
              <th>JOIN</th>
              <th>END</th>
              <th>DAYS</th>
              <th>PER DAY</th>
              <th>SALARY</th>
              <th>CREDIT</th>
              <th>DEBIT</th>
              <th>BALANCE</th>
            </tr>
          </thead>

          <tbody>
            {ledger.map((x, i) => (
              <tr key={i} className="border-t text-center">
                <td>{x.txn_date}</td>
                <td>{x.join_date}</td>
                <td>{x.end_date}</td>
                <td>{x.total_days}</td>
                <td>{x.per_day_rate}</td>
                <td>{x.salary_amount}</td>
                <td className="text-green-600">
                  {x.credit_amount || "-"}
                </td>
                <td className="text-red-500">
                  {x.debit_amount || "-"}
                </td>
                <td>{x.closing_balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ===============================
  // ALL DRIVER LIST VIEW
  // ===============================
  return (
    <div className="p-6 space-y-4">

      <h2 className="font-semibold text-lg">Driver Ledger</h2>

      <div className="grid grid-cols-4 gap-3">
        <Input
          placeholder="Search Driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input type="date" onChange={(e) => setFromDate(e.target.value)} />
        <Input type="date" onChange={(e) => setToDate(e.target.value)} />
        <Button onClick={loadDrivers}>Apply</Button>
      </div>

      <table className="w-full text-sm bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th>DRIVER</th>
            <th>WTL</th>
            <th>BALANCE</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((x) => (
            <tr key={x.driver_id} className="border-t text-center">
              <td
                className="text-blue-600 cursor-pointer"
                onClick={() => openLedger(x)}
              >
                {x.driver_name}
              </td>
              <td>{x.driver_code}</td>
              <td>{x.balance}</td>
              <td>
                <Button onClick={() => openLedger(x)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-2 items-center">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </Button>
        <span>Page {page}</span>
        <Button onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </div>

    </div>
  );
}
