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
  uri: string;
  title: string;
  image: string;
  type: 'Album' | 'Track' | 'Artist' | 'Profile';
  id: string;
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
                uri: profile.id.toString(),
                title: `${profile.username}`,
                image: profile.display_picture,
                type: 'Profile',
                id: " "
            })) || [],

            albums: data.albums?.map(album => ({
                uri: album.uri,
                title: album.name,
                image: album.images[0]?.url || '',
                type: 'Album',
                id: " "
            })) || [],

            artists: data.artists?.map(artist => ({
                uri: artist.uri,
                title: artist.name,
                image: artist.images[0]?.url || '',
                type: 'Artist',
                id: " "
            })) || [],

            tracks: data.tracks?.map(track => ({
                uri: track.uri,
                title: track.name,
                image: track.album.images[0]?.url || '',
                type: 'Track',
                id: " "
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

interface AddSearchParams {
    content_type: 'Album' | 'Track' | 'Artist' | 'Profile';
    content_id: string;
}

/**
 * Add a search item to user's recent searches
 * @param type The type of content (Album, Track, Artist, Profile)
 * @param id The content's unique identifier
 * @returns Promise with the response data
 */
export const addSearch = async (type: AddSearchParams['content_type'], id: string) => {
    try {
        const response = await api.get('/search/add/', {
            params: {
                content_type: type,
                content_id: id
            }
        });
        return response.data;
    } catch (error: any) {
        console.error('Failed to add search:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

interface ReviewParams {
    content_type: 'Album' | 'Track' | 'Artist';
    content_id: string;
    rating: number;
    review_text: string;
}

/**
 * Submit a review for an album, track, or artist
 * @param type The type of content being reviewed
 * @param id The content's unique identifier
 * @param rating Rating value (typically 1-5)
 * @param text Review text content
 * @returns Promise with the response data
 */
export const review = async (
    type: ReviewParams['content_type'],
    id: string,
    rating: number,
    text: string
) => {
    try {
        const response = await api.post('/reviews/', {
            content_type: type,
            content_id: id,
            rating: rating,
            review_text: text
        });
        return response.data;
    } catch (error: any) {
        console.error('Failed to submit review:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

export default api;
