import axios from 'axios';
import { getItem } from './storage';

const api = axios.create({
    baseURL: 'http://192.168.1.209:8000/api', // Replace with your LAN IP
});

api.interceptors.request.use(
    async (config) => {
        try {
            const token = await getItem('accessToken'); // Fetch the token using getItem
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error adding Authorization header:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
