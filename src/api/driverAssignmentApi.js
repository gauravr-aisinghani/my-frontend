import api from "./axiosInstance";

const BASE_URL = "/driver-assignments";

// ================= 1️⃣ ADVANCE PAID TRANSPORTER REQUESTS =================
export const getAdvancePaidTransporterRequests = async () => {
  try {
    const res = await api.get(`${BASE_URL}/advance-paid-requests`, {
      withCredentials: true,
    });
    return res.data; // snake_case response
  } catch (err) {
    console.error("Error fetching transporter requests", err);
    throw err;
  }
};

// ================= 2️⃣ AVAILABLE DRIVERS =================
export const getAvailableDrivers = async () => {
  try {
    const res = await api.get(`${BASE_URL}/available-drivers`, {
      withCredentials: true,
    });
    return res.data; // snake_case response
  } catch (err) {
    console.error("Error fetching drivers", err);
    throw err;
  }
};

// ================= 3️⃣ ASSIGN DRIVER =================
export const assignDriverToRequest = async (data) => {
  try {
    const res = await api.post(`${BASE_URL}/assign`, data, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data; // snake_case response
  } catch (err) {
    console.error("Error assigning driver", err);
    throw err;
  }
};
