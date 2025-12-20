import axios from "axios";

const api = axios.create({
  baseURL: "https://my-backend-1-qxc9.onrender.com/api/transporter-vehicle",
  withCredentials: true,
});

export const saveTransporterVehicle = async (data) => {
  try {
    const res = await api.post("", data);
    return res.data;
  } catch (error) {
    console.error("Error saving transporter vehicle:", error);
    throw error;
  }
};
