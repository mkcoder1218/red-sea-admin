import axios from 'axios';
import { configure } from 'axios-hooks';

// Create axios instance
export const axiosClient = axios.create({
  baseURL: 'https://api.redseamart.et',
  headers: { 'Content-Type': 'application/json' },
});

// Add interceptor to include Bearer token from localStorage
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // your token key
    if (token) {
      (config as any).headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Configure axios-hooks globally
configure({ axios: axiosClient });
