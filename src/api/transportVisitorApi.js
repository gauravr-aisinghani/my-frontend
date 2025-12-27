import api from "./axiosInstance";

// ✅ Relative path (api already has baseURL)
const BASE_URL = "/api/visitor-transporter";

// save visitor (POST)
export const saveTransportVisitor = async (visitorData) => {
  try {
    const res = await api.post(BASE_URL, visitorData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error saving transport visitor", err);
    throw err;
  }
};

// get all visitors (GET)
export const getAllTransportVisitors = async () => {
  try {
    const res = await api.get(BASE_URL, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching transport visitors", err);
    throw err;
  }
};

// get visitor by id (GET)
export const getTransportVisitorById = async (id) => {
  try {
    const res = await api.get(`${BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching transport visitor by id", err);
    throw err;
  }
};

// update visitor (PUT)
export const updateTransportVisitor = async (id, visitorData) => {
  try {
    const res = await api.put(`${BASE_URL}/${id}`, visitorData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error updating transport visitor", err);
    throw err;
  }
};

// delete visitor (DELETE)
export const deleteTransportVisitor = async (id) => {
  try {
    const res = await api.delete(`${BASE_URL}/${id}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting transport visitor", err);
    throw err;
  }
};
