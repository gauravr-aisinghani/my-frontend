import React, { useState } from "react";

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
  >
    {children}
  </button>
);

const Input = (props) => (
  <input {...props} className="border rounded px-3 py-2 w-full" />
);

// Dummy data
const allDrivers = Array.from({ length: 8 }).map((_, i) => ({
  date: "26-01-26",
  name: "Ramesh Kumar",
  wtl: "WTL00" + i,
  ac: "Driver",
  credit: i % 2 === 0 ? 3000 : "-",
  debit: i % 2 !== 0 ? 1500 : "-",
  balance: 25000 - i * 500,
}));

const perDriver = Array.from({ length: 5 }).map((_, i) => ({
  date: "26-01-26",
  joining: "01-01-26",
  end: "26-01-26",
  days: 26,
  perDay: 500,
  salary: 13000,
  credit: i % 2 === 0 ? 3000 : "-",
  debit: i % 2 !== 0 ? 1500 : "-",
  balance: 13000 - i * 1000,
}));

export default function DriverLedger() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">

      <h1 className="text-xl font-semibold">Driver Ledger</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input placeholder="Search Driver..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <Input type="date" />
        <Input type="date" />
        <Button>Apply</Button>
      </div>

      {/* ALL DRIVER LEDGER */}

      <div className="bg-white rounded shadow">

        <div className="bg-orange-300 p-2 font-semibold text-center">
          ALL DRIVER'S LEDGER
        </div>

        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">DATE</th>
              <th>DRIVER NAME</th>
              <th>WTL ID</th>
              <th>A/C</th>
              <th>CREDIT</th>
              <th>DEBIT</th>
              <th>BALANCE</th>
            </tr>
          </thead>

          <tbody>
            {allDrivers.map((x, i) => (
              <tr key={i} className="border-t text-center">
                <td className="p-2">{x.date}</td>
                <td>{x.name}</td>
                <td>{x.wtl}</td>
                <td>{x.ac}</td>
                <td className="text-green-600">{x.credit}</td>
                <td className="text-red-500">{x.debit}</td>
                <td>₹{x.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

      {/* PER DRIVER LEDGER */}

      <div className="bg-white rounded shadow">

        <div className="bg-orange-300 p-2 font-semibold flex justify-between">
          <span>PER DRIVER LEDGER</span>
          <span>DRIVER NAME: Ramesh Kumar | WTL DRIVER ID: WTL001</span>
        </div>

        <table className="w-full text-sm">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">DATE</th>
              <th>JOINING</th>
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
            {perDriver.map((x, i) => (
              <tr key={i} className="border-t text-center">
                <td className="p-2">{x.date}</td>
                <td>{x.joining}</td>
                <td>{x.end}</td>
                <td>{x.days}</td>
                <td>₹{x.perDay}</td>
                <td>₹{x.salary}</td>
                <td className="text-green-600">{x.credit}</td>
                <td className="text-red-500">{x.debit}</td>
                <td>₹{x.balance}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}
