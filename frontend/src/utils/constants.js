// ============================================================
// src/utils/constants.js
// ============================================================
// Central place for all application-wide constants.
// Change these to update labels/options across the entire UI.

export const JOB_TYPES = [
  { value: 'full-time', label: 'Full Time' },
  { value: 'part-time', label: 'Part Time' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
];

export const APPLICATION_STATUSES = {
  applied: { label: 'Applied', color: 'blue' },
  shortlisted: { label: 'Shortlisted', color: 'yellow' },
  rejected: { label: 'Rejected', color: 'red' },
  hired: { label: 'Hired', color: 'green' },
};

export const JOB_STATUSES = {
  pending: { label: 'Pending Review', color: 'yellow' },
  approved: { label: 'Active', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
  closed: { label: 'Closed', color: 'gray' },
};

export const EXPERIENCE_LEVELS = [
  { value: '0', label: 'Fresher (0 years)' },
  { value: '1', label: '1+ years' },
  { value: '2', label: '2+ years' },
  { value: '3', label: '3+ years' },
  { value: '5', label: '5+ years' },
  { value: '8', label: '8+ years' },
  { value: '10', label: '10+ years' },
];

export const SALARY_RANGES = [
  { value: '', label: 'Any Salary' },
  { value: '0-300000', label: 'Up to ₹3 LPA' },
  { value: '300000-600000', label: '₹3 - ₹6 LPA' },
  { value: '600000-1000000', label: '₹6 - ₹10 LPA' },
  { value: '1000000-1500000', label: '₹10 - ₹15 LPA' },
  { value: '1500000-9999999', label: '₹15 LPA+' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'relevance', label: 'Best Match' },
];

export const ROLES = {
  SEEKER: 'seeker',
  EMPLOYER: 'employer',
  ADMIN: 'admin',
};

export const TOKEN_KEY = 'jp_token';
export const USER_KEY = 'jp_user';
