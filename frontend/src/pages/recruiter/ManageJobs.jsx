// src/pages/recruiter/ManageJobs.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Users, Search } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { useToast } from '../../context/ToastContext';
import { formatDate, timeAgo } from '../../utils/helpers';
import { JOB_STATUSES, JOB_TYPES } from '../../utils/constants';
import * as jobService from '../../services/jobService';

export default function ManageJobs() {
  const toast = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await jobService.getMyJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      toast.error('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await jobService.deleteJob(deleteTarget.id);
      setJobs((prev) => prev.filter((j) => j.id !== deleteTarget.id));
      toast.success('Job deleted successfully');
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to delete job');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = jobs.filter((j) =>
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Header */}
        <div className="flex-between" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 4 }}>Manage Jobs</h1>
            <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
              {jobs.length} job post{jobs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="input-wrapper" style={{ width: 240 }}>
              <Search size={16} className="input-icon" />
              <input
                className="input"
                placeholder="Search your jobs…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Link to="/recruiter/post-job" className="btn btn--primary">
              <Plus size={16} /> Post New Job
            </Link>
          </div>
        </div>

        {loading ? (
          <Spinner text="Loading your jobs…" />
        ) : jobs.length === 0 ? (
          <EmptyState
            title="No job posts yet"
            description="Start hiring by posting your first job. It'll be reviewed and go live shortly."
            action={<Link to="/recruiter/post-job" className="btn btn--primary"><Plus size={16} /> Post a Job</Link>}
          />
        ) : filtered.length === 0 ? (
          <EmptyState title="No results" description="No jobs match your search." />
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Posted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((job) => {
                  const statusConfig = JOB_STATUSES[job.status] || { label: job.status, color: 'gray' };
                  const typeLabel = JOB_TYPES.find((t) => t.value === job.job_type)?.label || job.job_type;
                  return (
                    <tr key={job.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{job.title}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', marginTop: 2 }}>{job.location}</div>
                        {job.skills?.length > 0 && (
                          <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                            {job.skills.slice(0, 3).map((s) => (
                              <span key={s} className="tag" style={{ fontSize: 10 }}>{s}</span>
                            ))}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge--purple">{typeLabel}</span>
                      </td>
                      <td>
                        <span className={`badge badge--${statusConfig.color}`}>{statusConfig.label}</span>
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                        {job.deadline ? formatDate(job.deadline) : '—'}
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                        {timeAgo(job.createdAt)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <Link to={`/jobs/${job.id}`} className="btn btn--ghost btn--sm" title="View public listing">
                            <Eye size={14} />
                          </Link>
                          <Link to={`/recruiter/jobs/${job.id}/edit`} className="btn btn--ghost btn--sm" title="Edit">
                            <Edit size={14} />
                          </Link>
                          <Link to={`/recruiter/jobs/${job.id}/applications`} className="btn btn--primary btn--sm" title="View applicants">
                            <Users size={14} />
                          </Link>
                          <button
                            className="btn btn--danger btn--sm"
                            title="Delete"
                            onClick={() => setDeleteTarget(job)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Job Post"
        footer={
          <>
            <button className="btn btn--ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button
              className={`btn btn--danger ${deleting ? 'btn--loading' : ''}`}
              onClick={handleDelete}
              disabled={deleting}
            >
              {!deleting && <><Trash2 size={14} /> Delete Job</>}
            </button>
          </>
        }
      >
        <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>
          Are you sure you want to delete <strong>{deleteTarget?.title}</strong>?
          This action cannot be undone and all associated applications will also be removed.
        </p>
      </Modal>
    </Layout>
  );
}
