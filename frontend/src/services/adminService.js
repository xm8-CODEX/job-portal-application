// ============================================================
// src/services/adminService.js
// ============================================================
// Maps to backend routes: /api/admin/* (admin role required)
//   GET    /api/admin/jobs/pending      → getPendingJobs
//   PATCH  /api/admin/jobs/:id/moderate → moderateJob
//   GET    /api/admin/users             → getAllUsers
//   DELETE /api/admin/users/:id         → deleteUser
//   GET    /api/admin/analytics         → getAnalytics

import api from './api';

export const getPendingJobs = async () => {
  const response = await api.get('/admin/jobs/pending');
  return response.data;
};

export const moderateJob = async (id, status) => {
  const response = await api.patch(`/admin/jobs/${id}/moderate`, { status });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};
