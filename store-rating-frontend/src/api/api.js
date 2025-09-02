import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // backend base URL
  headers: {
    "Content-Type": "application/json"
  }
});


// Automatically attach token if exists
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default api;
