import axios from "axios";

// const API_BASE_URL = "http://localhost:8089/api/visitors"; // change if needed
const API_BASE_URL="https://my-backend-1-qxc9.onrender.com/api/driver-documents";

export const getVisitors = async (page = 0, size = 10) => {
  return axios.get(`${API_BASE_URL}?page=${page}&size=${size}`);
};

export const addVisitor = async (visitorData) => {
  return axios.post(API_BASE_URL, visitorData);
};
