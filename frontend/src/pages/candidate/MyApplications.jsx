// src/pages/candidate/MyApplications.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, ExternalLink } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import StatusBadge from '../../components/applications/StatusBadge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import { formatDate, timeAgo } from '../../utils/helpers';
import * as applicationService from '../../services/applicationService';

const STATUS_STEPS = ['applied', 'shortlisted', 'hired'];

function ApplicationCard({ app }) {
  const job = app.Job;
  const stepIndex = STATUS_STEPS.indexOf(app.status);
  const isRejected = app.status === 'rejected';

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', flexShrink: 0 }}>
          {job?.title?.[0] || 'J'}
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 4 }}>
            {job?.title || 'Job Position'}
          </h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--gray-500)', fontSize: 'var(--text-xs)' }}>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <MapPin size={12} /> {job?.location}
            </span>
            <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <Calendar size={12} /> Applied {timeAgo(app.createdAt)}
            </span>
            {app.match_score != null && (
              <span className="job-card__match-score" style={{ fontSize: 10 }}>
                🎯 {Math.round(app.match_score * 100)}% Match
              </span>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <StatusBadge status={app.status} />
          {job?.id && (
            <Link to={`/jobs/${job.id}`} className="btn btn--ghost btn--sm">
              <ExternalLink size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      {!isRejected ? (
        <div className="status-steps">
          {STATUS_STEPS.map((step, i) => {
            const isDone = i < stepIndex;
            const isActive = i === stepIndex;
            return (
              <div
                key={step}
                className={`status-step ${isDone ? 'done' : isActive ? 'active' : ''}`}
              >
                <div className="status-step__dot">
                  {isDone ? '✓' : i + 1}
                </div>
                <div className="status-step__label" style={{ textTransform: 'capitalize' }}>
                  {step}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'var(--error-bg)', borderRadius: 8 }}>
          <span style={{ color: 'var(--error)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>
            ❌ Application was not selected for this role. Keep applying!
          </span>
        </div>
      )}

      {app.cover_note && (
        <div style={{ marginTop: 16, padding: 14, background: 'var(--gray-50)', borderRadius: 8 }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your Cover Note
          </p>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-700)', lineHeight: 1.6 }}>
            {app.cover_note.length > 200 ? app.cover_note.slice(0, 200) + '...' : app.cover_note}
          </p>
        </div>
      )}
    </div>
  );
}

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    (async () => {
      try {
        const data = await applicationService.getMyApplications();
        setApplications(data.applications || []);
      } catch (err) {
        setError(err.friendlyMessage || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = activeFilter === 'all'
    ? applications
    : applications.filter((a) => a.status === activeFilter);

  const counts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const filterBtns = [
    { key: 'all', label: `All (${applications.length})` },
    { key: 'applied', label: `Applied (${counts.applied || 0})` },
    { key: 'shortlisted', label: `Shortlisted (${counts.shortlisted || 0})` },
    { key: 'hired', label: `Hired (${counts.hired || 0})` },
    { key: 'rejected', label: `Rejected (${counts.rejected || 0})` },
  ];

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 24px', maxWidth: 860 }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 4 }}>My Applications</h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
            Track and manage all your job applications
          </p>
        </div>

        {/* Filter tabs */}
        <div className="tabs">
          {filterBtns.map((btn) => (
            <button
              key={btn.key}
              className={`tab-btn ${activeFilter === btn.key ? 'active' : ''}`}
              onClick={() => setActiveFilter(btn.key)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {loading ? (
          <Spinner text="Loading your applications…" />
        ) : error ? (
          <ErrorState message={error} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No applications found"
            description={activeFilter === 'all' ? "You haven't applied to any jobs yet. Start browsing!" : `No ${activeFilter} applications.`}
            action={<Link to="/jobs" className="btn btn--primary">Browse Jobs</Link>}
          />
        ) : (
          <div>
            {filtered.map((app) => (
              <ApplicationCard key={app.id} app={app} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
