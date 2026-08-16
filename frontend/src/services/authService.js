// ============================================================
// src/services/authService.js
// ============================================================
// Maps to backend routes: /api/auth/*
//   POST /api/auth/register  → register
//   POST /api/auth/login     → login
//   GET  /api/auth/me        → getMe

import api from './api';

/**
 * Register a new user.
 * @param {{ name, email, password, role, company_name? }} data
 */
export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  return response.data; // { success, token, user }
};

/**
 * Login with email + password.
 * @param {{ email, password }} data
 */
export const login = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data; // { success, token, user }
};

/**
 * Get the currently authenticated user (and their profile if seeker).
 */
export const getMe = async () => {
  const response = await api.get('/auth/me');
  return response.data; // { success, user }
};

/**
 * Update seeker profile (bio, skills, education, experience_years).
 * NOTE: This endpoint needs to be added to the backend.
 * Backend route: PUT /api/auth/profile
 */
export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data;
};

/**
 * Upload default resume for seeker profile.
 * Backend route: POST /api/auth/profile/resume
 * Uses multipart/form-data with field name: "resume"
 */
export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  const response = await api.post('/auth/profile/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};
