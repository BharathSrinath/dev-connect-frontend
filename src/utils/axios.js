import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://dev-connect-backend-6vpt.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
