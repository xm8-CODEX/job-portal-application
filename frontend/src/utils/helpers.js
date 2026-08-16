// ============================================================
// src/utils/helpers.js
// ============================================================

/** Format a date string into e.g. "12 Aug 2026" */
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/** Format date as relative: "2 days ago" */
export function timeAgo(dateStr) {
  if (!dateStr) return '';
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 5) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    return `${Math.floor(months / 12)}y ago`;
  } catch {
    return dateStr;
  }
}

/** Format salary from numbers, e.g. 600000 => "₹6 LPA" */
export function formatSalary(min, max) {
  if (!min && !max) return 'Not Disclosed';
  const fmt = (n) => {
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} LPA`;
    if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
    return `₹${n}`;
  };
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
}

/** Truncate text to N chars */
export function truncate(text, n = 120) {
  if (!text) return '';
  return text.length > n ? text.slice(0, n) + '...' : text;
}

/** Capitalize first letter */
export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Build query string from an object, skipping empty values */
export function buildQuery(params) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) q.set(k, v);
  });
  return q.toString();
}

/** Parse a salary range string like "300000-600000" */
export function parseSalaryRange(rangeStr) {
  if (!rangeStr) return { minSalary: '', maxSalary: '' };
  const [min, max] = rangeStr.split('-');
  return { minSalary: min || '', maxSalary: max || '' };
}

/** Get initials from a name */
export function getInitials(name = '') {
  return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
}
