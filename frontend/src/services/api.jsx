import axios from 'axios';

// 1. Use the environment variable for the production URL, but fall back to localhost for development.
//    Vite uses `import.meta.env.VITE_` prefix for environment variables.
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log(`API calls are being sent to: ${API_BASE}`); // This will help you debug

const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('kmrl_user');
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
