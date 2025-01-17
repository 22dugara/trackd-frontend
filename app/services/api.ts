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

/**
 * Fetch user profile data for the authenticated user.
 */
export const fetchUserProfile = async () => {
    try {
        const response = await api.get('/profiles/me/'); // Fetch profile using the /profiles/me/ endpoint
        console.log(response.data);
        return response.data; // Return the profile data
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error; // Propagate the error for the calling function to handle
    }
};

/**
 * Fetch recent searches for the user
 */
export const fetchRecentSearches = async () => {
    try {
        const response = await api.get('/profiles/recent_searches/');
        return response.data;
    } catch (error) {
        console.error('Error fetching recent searches:', error);
        // Return empty array if the request fails
        return [];
    }
};

export default api;
