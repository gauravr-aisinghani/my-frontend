import React, { useEffect, useState } from "react";
import {
  fetchTransporterLedgers,
  fetchSingleTransporterLedger,
} from "../../api/transporterLedgerApi";

/* ===============================
   UI HELPERS
================================ */
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

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatText = (text) =>
  text
    ?.toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

/* ===============================
   COMPONENT
================================ */
export default function TransporterLedger() {
  const [transporters, setTransporters] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const perPage = 8;

  /* ===============================
     LOAD ALL TRANSPORTERS
  ================================ */
  const loadTransporters = async () => {
    const data = await fetchTransporterLedgers({
      search,
      from_date: fromDate,
      to_date: toDate,
      page,
      size: perPage,
    });

    setTransporters(data.content || data);
  };

  useEffect(() => {
    loadTransporters();
  }, [page]);

  /* ===============================
     OPEN TRANSPORTER LEDGER
  ================================ */
  const openLedger = async (transporter) => {
    setSelected(transporter);

    const data = await fetchSingleTransporterLedger(
      transporter.code // ✅ GDC NUMBER
    );

    setLedger(data);
  };

  /* ===============================
     SINGLE LEDGER VIEW
  ================================ */
  if (selected) {
    return (
      <div className="max-w-7xl mx-auto p-4 space-y-3">
        <Button onClick={() => setSelected(null)}>← Back</Button>

        <div className="bg-orange-300 p-3 font-semibold rounded">
          Transporter : {selected.name} | GDC : {selected.code}
        </div>

        <table className="w-full text-sm bg-white shadow rounded">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th>DATE</th>
              <th>DESCRIPTION</th>
              <th className="text-right">CREDIT</th>
              <th className="text-right">DEBIT</th>
              <th className="text-right">BALANCE</th>
            </tr>
          </thead>

          <tbody>
            {ledger.map((x, i) => (
              <tr key={i} className="border-t text-center">
                <td>{formatDate(x.txn_date)}</td>

                <td>{formatText(x.description)}</td>

                <td className="text-green-600 text-right font-medium">
                  {x.credit_amount ? `₹ ${x.credit_amount}` : "-"}
                </td>

                <td className="text-red-500 text-right font-medium">
                  {x.debit_amount ? `₹ ${x.debit_amount}` : "-"}
                </td>

                <td className="text-right font-semibold">
                  ₹ {x.closing_balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  /* ===============================
     TRANSPORTER LIST VIEW
  ================================ */
  return (
    <div className="p-6 space-y-4">
      <h2 className="font-semibold text-lg">Transporter Ledger</h2>

      <div className="grid grid-cols-4 gap-3">
        <Input
          placeholder="Search Transporter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Input type="date" onChange={(e) => setFromDate(e.target.value)} />
        <Input type="date" onChange={(e) => setToDate(e.target.value)} />
        <Button onClick={loadTransporters}>Apply</Button>
      </div>

      <table className="w-full text-sm bg-white shadow rounded">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th>TRANSPORTER</th>
            <th>GDC</th>
            <th>BALANCE</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody>
          {transporters.map((x) => (
            <tr key={x.id} className="border-t text-center">
              <td
                className="text-blue-600 cursor-pointer"
                onClick={() => openLedger(x)}
              >
                {x.name}
              </td>
              <td>{x.code}</td>
              <td className="font-medium">₹ {x.balance}</td>
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
        <Button onClick={() => setPage(page + 1)}>Next</Button>
      </div>
    </div>
  );
}
