// ============================================================
// src/services/applicationService.js
// ============================================================
// Maps to backend routes: /api/applications/*
//   POST   /api/applications/:jobId             → applyToJob (seeker)
//   GET    /api/applications/me                 → getMyApplications (seeker)
//   GET    /api/applications/job/:jobId         → getApplicationsForJob (employer)
//   PATCH  /api/applications/:id/status         → updateApplicationStatus (employer)

import api from './api';

/**
 * Apply to a job (seeker).
 * Sends multipart/form-data with optional file upload and cover_note.
 * @param {string} jobId
 * @param {{ cover_note?: string, resumeFile?: File }} data
 */
export const applyToJob = async (jobId, { cover_note, resumeFile } = {}) => {
  const formData = new FormData();
  if (cover_note) formData.append('cover_note', cover_note);
  if (resumeFile) formData.append('resume', resumeFile);

  const response = await api.post(`/applications/${jobId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data; // { success, application }
};

/**
 * Get all applications submitted by the logged-in seeker.
 */
export const getMyApplications = async () => {
  const response = await api.get('/applications/me');
  return response.data; // { success, applications }
};

/**
 * Get all applications for a specific job (employer only).
 * @param {string} jobId
 */
export const getApplicationsForJob = async (jobId) => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data; // { success, applications }
};

/**
 * Update application status (employer only).
 * @param {string} id  Application ID
 * @param {'applied'|'shortlisted'|'rejected'|'hired'} status
 */
export const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}/status`, { status });
  return response.data; // { success, application }
};
