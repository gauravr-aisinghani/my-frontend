import api from "./axiosInstance";


// const api = axios.create({
//   baseURL: `${api}/api/transporter`,
//   withCredentials: true,
// });

export const saveTransporterDetails = async (data) => {
  try {
    const res = await api.post("/api/transporter/step1", data);
    return res.data; // contains transporter_registration_id
  } catch (error) {
    console.error("Error saving transporter details", error);
    throw error;
  }
};
