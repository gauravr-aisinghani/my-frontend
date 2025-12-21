import axios from "axios";

const API_URL = "/api/reports/drivers";

// toggle this flag later
const USE_MOCK = true;

/* ================= MOCK DATA ================= */

const mockResponse = {
  summary: {
    visitor: 120,
    registered: 95,
    approved: 70,
    verificationPending: 18,
    gdcNotGenerated: 14,
    gdcGenerated: 56,
    paymentPaid: 60,
    paymentPending: 35
  },
  drivers: [
    {
      id: "DR001",
      name: "Ramesh Kumar",
      mobile: "9876543210",
      status: "VISITOR",
      verificationStatus: "PENDING",
      gdcGenerated: false,
      paymentStatus: "PENDING"
    },
    {
      id: "DR002",
      name: "Suresh Yadav",
      mobile: "9123456780",
      status: "REGISTERED",
      verificationStatus: "DONE",
      gdcGenerated: false,
      paymentStatus: "PENDING"
    },
    {
      id: "DR003",
      name: "Mahesh Singh",
      mobile: "9988776655",
      status: "APPROVED",
      verificationStatus: "DONE",
      gdcGenerated: true,
      paymentStatus: "PAID"
    },
    {
      id: "DR004",
      name: "Amit Verma",
      mobile: "9012345678",
      status: "APPROVED",
      verificationStatus: "DONE",
      gdcGenerated: false,
      paymentStatus: "PAID"
    }
  ]
};

/* ================= API FUNCTION ================= */

export const fetchDriverReports = async (params) => {
  if (USE_MOCK) {
    console.log("Using MOCK Driver Reports data");

    // simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockResponse });
      }, 500);
    });
  }

  return axios.get(API_URL, { params });
};
