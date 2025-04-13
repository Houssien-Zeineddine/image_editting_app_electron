import axios from "axios";

const token = localStorage.getItem("access_token");

const axiosBaseUrl = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v0.1",

  headers: {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  },
});

export default axiosBaseUrl;