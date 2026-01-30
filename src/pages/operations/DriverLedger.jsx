import React, { useState } from "react";

/* Simple local UI components (no shadcn) */

const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="p-4">{children}</div>
);

const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
  >
    {children}
  </button>
);

const Input = (props) => (
  <input
    {...props}
    className="border rounded px-3 py-2 w-full"
  />
);

/* Dummy Data (later API se ayega) */

const ledgerData = Array.from({ length: 25 }).map((_, i) => ({
  date: "26-01-2026",
  driver: "Ramesh Kumar",
  description: i % 2 === 0 ? "Trip Payment" : "Advance Deduction",
  credit: i % 2 === 0 ? 3000 : 0,
  debit: i % 2 !== 0 ? 1500 : 0,
  balance: 25000 - i * 500,
}));

export default function DriverLedger() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const perPage = 8;

  const filtered = ledgerData.filter((x) =>
    x.driver.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(
    (page - 1) * perPage,
    page * perPage
  );

  const totalCredit = filtered.reduce((a, b) => a + b.credit, 0);
  const totalDebit = filtered.reduce((a, b) => a + b.debit, 0);
  const closingBalance =
    filtered.length > 0 ? filtered[filtered.length - 1].balance : 0;

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      <h1 className="text-2xl font-semibold">Driver Ledger</h1>

      {/* Search */}
      <div className="flex gap-3">
        <Input
          placeholder="Search Driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button>Search</Button>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">Total Credit</p>
            <p className="text-xl font-bold text-green-600">₹{totalCredit}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">Total Debit</p>
            <p className="text-xl font-bold text-red-500">₹{totalDebit}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm text-gray-500">Closing Balance</p>
            <p className="text-xl font-bold">₹{closingBalance}</p>
          </CardContent>
        </Card>

      </div>

      {/* Ledger Table */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-green-600 text-white">
            <tr>
              <th className="p-3 text-left">Date</th>
              <th>Description</th>
              <th>Driver</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Balance</th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((row, i) => (
              <tr key={i} className="border-t hover:bg-gray-50">
                <td className="p-3">{row.date}</td>
                <td>{row.description}</td>
                <td>{row.driver}</td>
                <td className="text-green-600">
                  {row.credit ? `₹${row.credit}` : "-"}
                </td>
                <td className="text-red-500">
                  {row.debit ? `₹${row.debit}` : "-"}
                </td>
                <td>₹{row.balance}</td>
              </tr>
            ))}
          </tbody>

        </table>

        {/* Pagination */}

        <div className="flex justify-end gap-2 p-4">

          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>

          <span className="px-4 py-2 border rounded">{page}</span>

          <Button
            disabled={page * perPage >= filtered.length}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>

        </div>

      </div>

    </div>
  );
}
