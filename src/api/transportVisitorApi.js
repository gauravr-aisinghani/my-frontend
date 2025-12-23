import api from "./axiosInstance";


// ✅ MUST MATCH BACKEND CONTROLLER
const BASE_URL =
  `${api}/api/visitor-transporter`;

// save visitor (POST)
export const saveTransportVisitor = async (visitorData) => {
  try {
    const res = await axios.post(BASE_URL, visitorData, {
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
    const res = await axios.get(BASE_URL, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    console.error("Error fetching transport visitors", err);
    throw err;
  }
};

// get by id
export const getTransportVisitorById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    console.error("Error fetching transport visitor by id", err);
    throw err;
  }
};

// update visitor
export const updateTransportVisitor = async (id, visitorData) => {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, visitorData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    console.error("Error updating transport visitor", err);
    throw err;
  }
};

// delete visitor
export const deleteTransportVisitor = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    console.error("Error deleting transport visitor", err);
    throw err;
  }
};
