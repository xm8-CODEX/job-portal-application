// ============================================================
// src/hooks/useSavedJobs.js
// ============================================================
// Manages saved/bookmarked jobs in localStorage (no backend needed).

import { useState, useCallback } from 'react';

const SAVED_JOBS_KEY = 'jp_saved_jobs';

function getStored() {
  try {
    const s = localStorage.getItem(SAVED_JOBS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

export function useSavedJobs() {
  const [savedIds, setSavedIds] = useState(getStored);

  const toggleSave = useCallback((jobId) => {
    setSavedIds((prev) => {
      const next = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isSaved = useCallback((jobId) => savedIds.includes(jobId), [savedIds]);

  const clearAll = useCallback(() => {
    setSavedIds([]);
    localStorage.removeItem(SAVED_JOBS_KEY);
  }, []);

  return { savedIds, toggleSave, isSaved, clearAll };
}
