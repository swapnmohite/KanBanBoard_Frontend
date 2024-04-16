import axios from "axios";

const api = axios.create({
    baseURL: "http://13.233.161.217:8080",
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
            // Logout user and redirect to login page
            // This depends on how you're handling authentication in your app
            // For example, you might call a logout function and then use a router to redirect to the login page

            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default api;
