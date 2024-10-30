
import axios from "axios"

export const multpartHeader = {
    "Content-Type": "multipart/form-data",
};

export const apiRequest = axios.create({
    baseURL: "https://cataloguewala.com/api",
    // baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json"
    }
})

apiRequest.interceptors.request.use(
    (config) => {
        // Get the token from local storage
        const token = localStorage.getItem("digital_catelogue_app_token");

        // If the token exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);

