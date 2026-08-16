// ============================================================
// src/hooks/useApi.js
// ============================================================
// Generic hook to manage async API calls: loading, error, and data state.

import { useState, useCallback } from 'react';

/**
 * useApi - wraps an async service function and manages its state.
 *
 * @param {Function} fn - async function to call (e.g. jobService.getJobs)
 * @returns {{ execute, data, loading, error, reset }}
 *
 * @example
 * const { execute, data, loading, error } = useApi(jobService.getJobs);
 * useEffect(() => { execute({ keyword: 'react' }); }, []);
 */
export function useApi(fn) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      try {
        const result = await fn(...args);
        setData(result);
        return result;
      } catch (err) {
        const msg = err.friendlyMessage || 'An unexpected error occurred';
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { execute, data, loading, error, reset };
}

export default useApi;
