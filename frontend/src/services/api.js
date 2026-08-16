// ============================================================
// src/services/api.js
// ============================================================
// Axios instance with JWT interceptors.
// All API calls go through here - change VITE_API_BASE_URL in .env
// to point to a different backend without touching any other file.

import axios from 'axios';
import { TOKEN_KEY } from '../utils/constants';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Attach Bearer token on every request if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      error.message ||
      'Something went wrong';

    // If 401, the AuthContext will handle the logout
    return Promise.reject({ ...error, friendlyMessage: message });
  }
);

export default api;
