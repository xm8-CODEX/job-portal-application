// src/pages/candidate/SavedJobs.jsx

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import JobCard from '../../components/jobs/JobCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import * as jobService from '../../services/jobService';

export default function SavedJobs() {
  const { savedIds, toggleSave, isSaved, clearAll } = useSavedJobs();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (savedIds.length === 0) { setLoading(false); return; }
    (async () => {
      try {
        // Fetch each saved job by ID
        const results = await Promise.allSettled(
          savedIds.map((id) => jobService.getJobById(id))
        );
        const loaded = results
          .filter((r) => r.status === 'fulfilled')
          .map((r) => r.value.job);
        setJobs(loaded);
      } catch (err) {
        setError('Failed to load saved jobs');
      } finally {
        setLoading(false);
      }
    })();
  }, [savedIds.length]);

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 24px' }}>
        <div className="flex-between" style={{ marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 4 }}>Saved Jobs</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
              {savedIds.length} job{savedIds.length !== 1 ? 's' : ''} saved
            </p>
          </div>
          {savedIds.length > 0 && (
            <button className="btn btn--danger btn--sm" onClick={clearAll}>
              <Trash2 size={14} /> Clear All
            </button>
          )}
        </div>

        {loading ? (
          <Spinner text="Loading saved jobs…" />
        ) : error ? (
          <ErrorState message={error} />
        ) : savedIds.length === 0 || jobs.length === 0 ? (
          <EmptyState
            title="No saved jobs"
            description="You haven't saved any jobs yet. Browse open positions and save the ones you like!"
            action={<Link to="/jobs" className="btn btn--primary"><Bookmark size={16} /> Browse Jobs</Link>}
          />
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onSave={toggleSave}
                isSaved={isSaved(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
