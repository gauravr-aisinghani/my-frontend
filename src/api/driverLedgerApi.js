import api from "./axiosInstance";

// ===============================
// GET ALL DRIVERS LEDGER LIST
// ===============================
export const fetchDriverLedgers = async ({
  search = "",
  from_date = "",
  to_date = "",
  page = 1,
  size = 8,
}) => {
  const res = await api.get("/api/ledger/drivers", {
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
// GET PARTICULAR DRIVER LEDGER
// ===============================
export const fetchSingleDriverLedger = async (gdc_number, driver_id) => {
  const res = await api.get(
    `/api/ledger/driver/${gdc_number}/${driver_id}`
  );

  return res.data;
};
