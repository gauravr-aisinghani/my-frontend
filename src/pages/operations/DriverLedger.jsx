import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const dummyDrivers = [
  { id: 1, name: "Ramesh Kumar" },
  { id: 2, name: "Suresh Singh" },
];

const ledgerData = Array.from({ length: 25 }).map((_, i) => ({
  date: "26-01-2026",
  driver: "Ramesh Kumar",
  description: "Trip Payment",
  credit: i % 2 === 0 ? 3000 : "",
  debit: i % 2 !== 0 ? 1500 : "",
  balance: 20000 - i * 500,
}));

export default function DriverLedger() {
  const [page, setPage] = useState(1);
  const perPage = 8;

  const paginated = ledgerData.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      <h1 className="text-2xl font-semibold">Driver Ledger</h1>

      {/* Filters */}
      <div className="flex gap-4">

        <Input placeholder="Search Driver..." />

        <Select>
          <SelectTrigger className="w-56">
            <SelectValue placeholder="Select Driver" />
          </SelectTrigger>
          <SelectContent>
            {dummyDrivers.map(d => (
              <SelectItem key={d.id} value={d.id.toString()}>
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="bg-green-600">Filter</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Credit</p>
            <p className="text-xl font-bold text-green-600">₹45,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Debit</p>
            <p className="text-xl font-bold text-red-500">₹18,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Closing Balance</p>
            <p className="text-xl font-bold">₹27,000</p>
          </CardContent>
        </Card>

      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl shadow">

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
                <td className="text-green-600">{row.credit && `₹${row.credit}`}</td>
                <td className="text-red-500">{row.debit && `₹${row.debit}`}</td>
                <td>₹{row.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end gap-2 p-4">

          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <span className="px-3 py-1 border rounded">
            {page}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>

        </div>

      </div>
    </div>
  );
}
