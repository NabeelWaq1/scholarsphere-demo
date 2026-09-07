import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : '';
const baseURL = !rawApiUrl || rawApiUrl === '/'
  ? '/api'
  : rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('scholarsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401s
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized on protected route, clean token
      const isAuthRoute = error.config.url.includes('/auth/login') || error.config.url.includes('/auth/signup');
      if (!isAuthRoute) {
        localStorage.removeItem('scholarsphere_token');
        localStorage.removeItem('scholarsphere_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
