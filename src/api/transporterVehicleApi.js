import api from "./axiosInstance";


// const api = axios.create({
//   baseURL: `${api}/api/transporter-vehicle`,
//   withCredentials: true,
// });

export const saveTransporterVehicle = async (data) => {
  try {
    const res = await api.post("", data);
    return res.data;
  } catch (error) {
    console.error("Error saving transporter vehicle:", error);
    throw error;
  }
};
