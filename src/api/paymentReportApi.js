import api from "./axiosInstance";

export const fetchPaymentReports = async (filters = {}) => {
  try {
    const res = await api.get("/api/reports/payments", {
      params: {
        paymentType:
          filters.paymentType && filters.paymentType.length > 0
            ? filters.paymentType
            : undefined,
        status:
          filters.status && filters.status.length > 0
            ? filters.status
            : undefined,
      },
    });

    console.log("Payment Report Params:", filters);
    console.log("Payment Report Response:", res.data);

    return res.data;
  } catch (error) {
    console.error("Error fetching payment reports:", error);
    throw error;
  }
};
