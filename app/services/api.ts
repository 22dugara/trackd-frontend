import axios from 'axios';
import { getItem } from './storage';

const production = false; // Toggle this for production/development

const api = axios.create({
    baseURL: production 
        ? 'https://trackd-backend-api-30cc0e199157.herokuapp.com/api'  // Production URL
        : 'http://10.0.0.170:8000/api', // Development URL
});

// Define endpoints that don't need authentication
const noAuthEndpoints = ['/register/', '/token/'];

api.interceptors.request.use(
    async (config) => {
        try {
            // Skip adding token for registration and login endpoints
            if (noAuthEndpoints.some(endpoint => config.url?.endsWith(endpoint))) {
                return config;
            }

            const token = await getItem('accessToken');
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

interface RegisterData {
    username: string;
    email: string;
    password: string;
    bio?: string;
    display_picture?: {
        uri: string;
        type: string;
        name: string;
    };
}

interface RegisterResponse {
    id: number;
    username: string;
    email: string;
    bio?: string;
    display_picture?: string;
}

/**
 * Register a new user
 * @param userData User registration data
 * @returns Promise with the registered user data
 */
export const registerUser = async (userData: RegisterData): Promise<RegisterResponse> => {
    try {
        const formData = new FormData();
        
        // Add required fields
        formData.append('username', userData.username);
        formData.append('email', userData.email);
        formData.append('password', userData.password);
        
        // Add optional fields if they exist
        if (userData.bio) {
            formData.append('bio', userData.bio);
        }
        
        if (userData.display_picture) {
            // Modify this to match Postman's file upload format
            formData.append('display_picture', {
                uri: userData.display_picture.uri,
                type: userData.display_picture.type,  // Use the actual mime type
                name: userData.display_picture.name,  // Use the actual filename
            } as any);
        }

        const response = await api.post('/register/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('Registration error:', error.response?.data || error.message);
        throw error;
    }
};

export interface SearchItem {
  id: string;
  title: string;
  image: string;
  type: 'Album' | 'Track' | 'Artist' | 'Profile';
}

interface SearchResponse {
  query: string;
  profiles: any[];
  albums: any[];
  artists: any[];
  tracks: any[];
}

interface SearchResults {
  profiles: SearchItem[];
  albums: SearchItem[];
  artists: SearchItem[];
  tracks: SearchItem[];
}

/**
 * Search for profiles, albums, artists, and tracks
 * @param query Search query string
 * @returns Promise with search results for all categories
 */
export const search = async (query: string): Promise<SearchResults> => {
    try {
        console.log('Making search request for:', query);
        const response = await api.get('/search/', {
            params: { q: query }
        });
        
        const data: SearchResponse = response.data;
        
        return {
            profiles: data.profiles?.map(profile => ({
                id: profile.id.toString(),
                title: `${profile.first_name} ${profile.last_name}`,
                image: profile.display_picture,
                type: 'Profile'
            })) || [],

            albums: data.albums?.map(album => ({
                id: album.id,
                title: album.name,
                image: album.images[0]?.url || '',
                type: 'Album'
            })) || [],

            artists: data.artists?.map(artist => ({
                id: artist.id,
                title: artist.name,
                image: artist.images[0]?.url || '',
                type: 'Artist'
            })) || [],

            tracks: data.tracks?.map(track => ({
                id: track.id,
                title: track.name,
                image: track.album.images[0]?.url || '',
                type: 'Track'
            })) || []
        };
    } catch (error: any) {
        console.error('Search request failed:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

export default api;
