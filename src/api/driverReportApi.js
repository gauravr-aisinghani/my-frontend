import axios from "axios";

const API_URL = "/api/reports/drivers";

export const fetchDriverReports = (params) => {
  return axios.get(API_URL, { params });
};
