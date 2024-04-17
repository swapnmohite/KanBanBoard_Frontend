import axios from "axios";

const api = axios.create({
    baseURL: "https://13.233.161.217:8080",
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwtToken");

        config.headers.Authorization = `Bearer ${token}`;

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;
