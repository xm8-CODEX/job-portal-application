// src/pages/recruiter/JobApplications.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Eye, FileText, TrendingUp } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import StatusBadge from '../../components/applications/StatusBadge';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { getInitials, formatDate, timeAgo } from '../../utils/helpers';
import { APPLICATION_STATUSES } from '../../utils/constants';
import * as applicationService from '../../services/applicationService';
import * as jobService from '../../services/jobService';

export default function JobApplications() {
  const { jobId } = useParams();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusModal, setStatusModal] = useState(null); // { appId, currentStatus }
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [jobData, appData] = await Promise.all([
          jobService.getJobById(jobId),
          applicationService.getApplicationsForJob(jobId),
        ]);
        setJob(jobData.job);
        setApplications(appData.applications || []);
      } catch (err) {
        setError(err.friendlyMessage || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    })();
  }, [jobId]);

  const handleStatusUpdate = async (newStatus) => {
    if (!statusModal) return;
    setUpdatingStatus(true);
    try {
      await applicationService.updateApplicationStatus(statusModal.appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => a.id === statusModal.appId ? { ...a, status: newStatus } : a)
      );
      toast.success(`Application marked as ${newStatus}`);
      setStatusModal(null);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) return <Layout><Spinner text="Loading applications…" /></Layout>;
  if (error) return <Layout><div className="container" style={{ padding: 48 }}><ErrorState message={error} /></div></Layout>;

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 24px' }}>
        <Link
          to="/recruiter/jobs"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gray-500)', fontSize: 'var(--text-sm)', marginBottom: 24 }}
        >
          <ArrowLeft size={16} /> Back to Jobs
        </Link>

        <div className="flex-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 4 }}>
              {job?.title} — Applicants
            </h1>
            <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
              {applications.length} application{applications.length !== 1 ? 's' : ''} • Sorted by AI match score
            </p>
          </div>
        </div>

        {applications.length === 0 ? (
          <EmptyState
            title="No applications yet"
            description="Candidates haven't applied to this job yet. Share the posting to get more reach!"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {applications.map((app, idx) => (
              <div key={app.id} className="candidate-card">
                {/* Rank */}
                <div
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: idx === 0 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'var(--gray-100)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--text-xs)', fontWeight: 800,
                    color: idx === 0 ? 'white' : 'var(--gray-500)', flexShrink: 0,
                  }}
                >
                  #{idx + 1}
                </div>

                {/* Avatar */}
                <div className="candidate-card__avatar">
                  {getInitials(app.seeker?.name || 'A')}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="candidate-card__name">{app.seeker?.name || 'Candidate'}</div>
                  <div className="candidate-card__email">{app.seeker?.email}</div>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {app.match_score != null && (
                      <span className="job-card__match-score">
                        <TrendingUp size={12} /> {Math.round(app.match_score * 100)}% Match
                      </span>
                    )}
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>
                      Applied {timeAgo(app.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                  <StatusBadge status={app.status} />
                  {app.resume_url && (
                    <a href={app.resume_url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm" title="View Resume">
                      <FileText size={14} /> Resume
                    </a>
                  )}
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => setSelectedApp(app)}
                    title="View Application"
                  >
                    <Eye size={14} /> View
                  </button>
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={() => setStatusModal({ appId: app.id, currentStatus: app.status })}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={!!statusModal}
        onClose={() => setStatusModal(null)}
        title="Update Application Status"
        size="sm"
      >
        <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)', marginBottom: 20 }}>
          Choose the new status for this application:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(APPLICATION_STATUSES).map(([key, val]) => (
            <button
              key={key}
              className={`btn ${statusModal?.currentStatus === key ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => handleStatusUpdate(key)}
              disabled={updatingStatus}
              style={{ justifyContent: 'space-between' }}
            >
              <span className={`badge badge--${val.color}`}>{val.label}</span>
              {statusModal?.currentStatus === key && '✓ Current'}
            </button>
          ))}
        </div>
      </Modal>

      {/* Application Detail Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details"
        size="md"
      >
        {selectedApp && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div className="candidate-card__avatar">{getInitials(selectedApp.seeker?.name)}</div>
              <div>
                <h3 style={{ fontWeight: 700 }}>{selectedApp.seeker?.name}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>{selectedApp.seeker?.email}</p>
              </div>
              <div style={{ marginLeft: 'auto' }}>
                <StatusBadge status={selectedApp.status} />
              </div>
            </div>

            {selectedApp.match_score != null && (
              <div style={{ padding: 16, background: 'var(--success-bg)', borderRadius: 10 }}>
                <p style={{ fontWeight: 700, color: 'var(--success)', marginBottom: 4 }}>
                  AI Match Score: {Math.round(selectedApp.match_score * 100)}%
                </p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-600)' }}>
                  Based on skill overlap and profile alignment
                </p>
              </div>
            )}

            {selectedApp.cover_note && (
              <div>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: 8 }}>Cover Note</p>
                <div style={{ padding: 16, background: 'var(--gray-50)', borderRadius: 10, fontSize: 'var(--text-sm)', color: 'var(--gray-700)', lineHeight: 1.7 }}>
                  {selectedApp.cover_note}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              {selectedApp.resume_url && (
                <a href={selectedApp.resume_url} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">
                  <FileText size={16} /> View Resume
                </a>
              )}
              <button
                className="btn btn--primary"
                onClick={() => { setSelectedApp(null); setStatusModal({ appId: selectedApp.id, currentStatus: selectedApp.status }); }}
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}
