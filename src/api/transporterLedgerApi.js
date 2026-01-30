import api from "./axiosInstance";

// ===============================
// GET ALL TRANSPORTER LEDGERS
// ===============================
export const fetchTransporterLedgers = async ({
  search = "",
  from_date = "",
  to_date = "",
  page = 1,
  size = 8,
}) => {
  const res = await api.get("/api/ledger/transporters", {
    params: {
      search,
      from_date,
      to_date,
      page,
      size,
    },
  });

  return res.data;
};

// ===============================
// GET PARTICULAR TRANSPORTER LEDGER
// ===============================
export const fetchSingleTransporterLedger = async (transporter_id) => {
  const res = await api.get(
    `/api/ledger/transporter/${transporter_id}`
  );
  return res.data;
};
