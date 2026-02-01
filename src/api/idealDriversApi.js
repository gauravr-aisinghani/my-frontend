import api from "./axiosConfig";

const idealDriversApi = {
  getIdealDrivers: () =>
    api.get("/driver-assignments/ideal-drivers"),
};

export default idealDriversApi;
