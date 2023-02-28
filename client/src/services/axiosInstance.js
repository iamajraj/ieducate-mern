import axios from "axios";
import { BASE_URL } from "../constant";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(function (config) {
    const token = JSON.parse(localStorage.getItem("token"));
    if (token) {
        config.headers.set("token", `Bearer ${token}`);
    }
    return config;
});

export default axiosInstance;
