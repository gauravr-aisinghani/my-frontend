import api from "./axiosInstance";

export const fetchTransporterReports = async (filters = {}) => {
  try {
    const res = await api.get("/api/reports/transporters", {
      params: {
        stage:
          filters.stage && filters.stage.length > 0
            ? filters.stage
            : undefined, // IMPORTANT
      },
    });

    console.log("API PARAMS:", filters);
    console.log("Backend Response:", res.data);

    return res.data;
  } catch (error) {
    console.error("Error fetching transporter reports:", error);
    throw error;
  }
};
