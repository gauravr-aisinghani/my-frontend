import api from "./axiosConfig";

const lastExperienceApi = {
  saveLastExperience: (driverId, data) =>
    api.post(`/api/drivers/experience/driver/${driverId}`, data, {
      headers: { "Content-Type": "application/json" },
    }),
};

export default lastExperienceApi;
