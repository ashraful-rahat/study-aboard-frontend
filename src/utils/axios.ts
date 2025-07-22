import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true, // যদি cookies লাগে, না লাগলে remove করো
});

// Interceptor দিয়ে সব request এ token attach করো
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
