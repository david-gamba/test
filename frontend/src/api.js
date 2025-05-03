// axios interceptor will first check if we have access token and if we do it will automatically add to the request

import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const apiUrl = "/choreo-apis/django-react/backend/v1"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : apiUrl, // this allow us import anything that is specified in the environment, our BE server
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) { // look to local storage if we have access
            config.headers.Authorization = `Bearer ${token}`;
            // this is how you pass JWT token - you create Authorization header which can be automatically handled by axios which is why we are using it
            // it needs to start with Bearer and space and token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api; // we export this object and we use api object 