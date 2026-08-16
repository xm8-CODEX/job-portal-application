// ============================================================
// src/services/jobService.js
// ============================================================
// Maps to backend routes: /api/jobs/*
//   GET    /api/jobs                  → getJobs (public + optional auth for match scores)
//   GET    /api/jobs/:id              → getJobById
//   GET    /api/jobs/employer/mine    → getMyJobs (employer)
//   POST   /api/jobs                  → createJob (employer)
//   PUT    /api/jobs/:id              → updateJob (employer)
//   DELETE /api/jobs/:id              → deleteJob (employer)

import api from './api';
import { buildQuery } from '../utils/helpers';

/**
 * Search / list approved jobs with filters.
 * Params: keyword, location, jobType, minSalary, maxSalary, page, limit
 */
export const getJobs = async (params = {}) => {
  const query = buildQuery(params);
  const response = await api.get(`/jobs${query ? `?${query}` : ''}`);
  return response.data; // { success, count, page, jobs }
};

/**
 * Get a single job by ID.
 */
export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data; // { success, job }
};

/**
 * Get all jobs posted by the logged-in employer.
 */
export const getMyJobs = async () => {
  const response = await api.get('/jobs/employer/mine');
  return response.data; // { success, jobs }
};

/**
 * Create a new job posting (employer only).
 * @param {{ title, description, skills, location, job_type, salary_min, salary_max, deadline }} data
 */
export const createJob = async (data) => {
  const response = await api.post('/jobs', data);
  return response.data; // { success, job }
};

/**
 * Update an existing job posting (employer only - own jobs).
 */
export const updateJob = async (id, data) => {
  const response = await api.put(`/jobs/${id}`, data);
  return response.data; // { success, job }
};

/**
 * Delete a job posting (employer only - own jobs).
 */
export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data; // { success, message }
};
