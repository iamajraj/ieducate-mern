import axios from "axios";
import { BASE_URL } from "../constant";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(function (config) {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.set("token", token);
    }
    return config;
});

export default axiosInstance;
