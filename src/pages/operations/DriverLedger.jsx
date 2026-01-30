import React, { useState } from "react";

const Button = ({ children, ...props }) => (
  <button {...props} className="px-3 py-1 bg-green-600 text-white rounded">
    {children}
  </button>
);

const Input = (props) => (
  <input {...props} className="border px-3 py-2 rounded w-full" />
);

// Dummy data
const drivers = Array.from({ length: 25 }).map((_, i) => ({
  id: i,
  name: "Ramesh Kumar",
  wtl: "WTL00" + i,
  date: "26-01-26",
  credit: i % 2 === 0 ? 3000 : "-",
  debit: i % 2 ? 1500 : "-",
  balance: 25000 - i * 500,
}));

const ledger = Array.from({ length: 10 }).map((_, i) => ({
  date: "26-01-26",
  joining: "01-01-26",
  end: "26-01-26",
  days: 26,
  perDay: 500,
  salary: 13000,
  credit: i % 2 === 0 ? 3000 : "-",
  debit: i % 2 ? 1500 : "-",
  balance: 13000 - i * 1000,
}));

export default function DriverLedger() {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [page, setPage] = useState(1);

  const perPage = 8;
  const paginated = drivers.slice((page - 1) * perPage, page * perPage);

  // PER DRIVER LEDGER VIEW
  if (selectedDriver) {
    return (
      <div className="p-6 space-y-4">

        <Button onClick={() => setSelectedDriver(null)}>← Back</Button>

        <div className="bg-orange-300 p-2 font-semibold">
          Driver Name: {selectedDriver.name} | WTL: {selectedDriver.wtl}
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
                <td>{x.date}</td>
                <td>{x.joining}</td>
                <td>{x.end}</td>
                <td>{x.days}</td>
                <td>{x.perDay}</td>
                <td>{x.salary}</td>
                <td className="text-green-600">{x.credit}</td>
                <td className="text-red-500">{x.debit}</td>
                <td>{x.balance}</td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    );
  }

  // ALL DRIVER LIST
  return (
    <div className="p-6 space-y-4">

      <h2 className="font-semibold text-lg">Driver Ledger</h2>

      <div className="grid grid-cols-4 gap-3">
        <Input placeholder="Search Driver..." />
        <Input type="date" />
        <Input type="date" />
        <Button>Apply</Button>
      </div>

      <table className="w-full text-sm bg-white shadow rounded">

        <thead className="bg-gray-100">
          <tr>
            <th>DATE</th>
            <th>DRIVER</th>
            <th>WTL</th>
            <th>CREDIT</th>
            <th>DEBIT</th>
            <th>BALANCE</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {paginated.map((x) => (
            <tr key={x.id} className="border-t text-center">
              <td>{x.date}</td>
              <td
                className="text-blue-600 cursor-pointer"
                onClick={() => setSelectedDriver(x)}
              >
                {x.name}
              </td>
              <td>{x.wtl}</td>
              <td className="text-green-600">{x.credit}</td>
              <td className="text-red-500">{x.debit}</td>
              <td>{x.balance}</td>
              <td>
                <Button onClick={() => setSelectedDriver(x)}>View</Button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* Pagination */}
      <div className="flex gap-2">
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
        <span>Page {page}</span>
        <Button onClick={() => setPage(page + 1)}>Next</Button>
      </div>

    </div>
  );
}
