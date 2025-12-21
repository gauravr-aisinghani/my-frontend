import axios from "axios";

const api = axios.create({
  baseURL: "https://my-backend-1-qxc9.onrender.com/api/reports/drivers",
  withCredentials: true,
});

export const fetchDriverReports = async (filters = {}) => {
  try {
    const res = await api.get("", {
      params: {
        stage: filters.stage && filters.stage.length > 0
          ? filters.stage
          : undefined,   // 🔑 IMPORTANT
      },
    });

    console.log("API CALL PARAMS:", filters);
    console.log("Backend Response:", res.data);

    return res.data;
  } catch (error) {
    console.error("Error fetching driver reports:", error);
    throw error;
  }
};
