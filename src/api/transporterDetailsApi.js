import axios from "axios";

const api = axios.create({
  baseURL: "https://my-backend-1-qxc9.onrender.com/api/transporter",
  withCredentials: true,
});

export const saveTransporterDetails = async (data) => {
  try {
    const res = await api.post("/step1", data);
    return res.data; // contains transporter_registration_id
  } catch (error) {
    console.error("Error saving transporter details", error);
    throw error;
  }
};
