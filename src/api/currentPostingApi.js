// currentPostingApi.js
import api from "./axiosConfig";

const currentPostingApi = {
  getCurrentPostings: () =>
    api.get("/driver-assignments/current-postings"),
};

export default currentPostingApi;
