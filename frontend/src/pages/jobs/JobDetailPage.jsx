// src/pages/jobs/JobDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, CalendarDays, Users, Clock, CheckCircle, Bookmark, Share2, ArrowLeft, Building } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import { formatSalary, formatDate, timeAgo } from '../../utils/helpers';
import { JOB_TYPES } from '../../utils/constants';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import * as jobService from '../../services/jobService';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const { toggleSave, isSaved } = useSavedJobs();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await jobService.getJobById(id);
        setJob(data.job);
      } catch (err) {
        setError(err.friendlyMessage || 'Job not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Layout><Spinner size="lg" text="Loading job details…" /></Layout>;
  if (error) return <Layout><div className="container" style={{ padding: '48px 0' }}><ErrorState message={error} /></div></Layout>;
  if (!job) return null;

  const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.job_type)?.label || job.job_type;
  const isExpired = job.deadline && new Date(job.deadline) < new Date();
  const canApply = isAuthenticated && user?.role === 'seeker' && !isExpired;

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.info('Please login to apply for jobs');
      navigate('/login');
      return;
    }
    navigate(`/jobs/${id}/apply`);
  };

  return (
    <Layout>
      {/* Hero */}
      <div className="job-detail-hero">
        <div className="container">
          <Link
            to="/jobs"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gray-500)', fontSize: 'var(--text-sm)', marginBottom: 24 }}
          >
            <ArrowLeft size={16} /> Back to jobs
          </Link>

          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div
              style={{
                width: 72, height: 72, borderRadius: 16,
                background: 'linear-gradient(135deg, var(--primary-bg), var(--primary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', fontWeight: 800, color: 'var(--primary)',
                border: '2px solid var(--gray-200)', flexShrink: 0,
              }}
            >
              {(job.employer?.company_name || job.employer?.name || '?')[0].toUpperCase()}
            </div>

            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 8 }}>
                {job.title}
              </h1>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', color: 'var(--gray-600)', fontSize: 'var(--text-sm)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600 }}>
                  <Building size={16} />
                  {job.employer?.company_name || job.employer?.name}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <MapPin size={16} /> {job.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={16} /> Posted {timeAgo(job.createdAt)}
                </span>
                {job.match_score != null && (
                  <span className="job-card__match-score">🎯 {Math.round(job.match_score * 100)}% Match</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className={`btn btn--ghost btn--sm`}
                onClick={() => { toggleSave(job.id); toast.success(isSaved(job.id) ? 'Job removed from saved' : 'Job saved!'); }}
              >
                <Bookmark size={16} fill={isSaved(job.id) ? 'var(--warning)' : 'none'} />
                {isSaved(job.id) ? 'Saved' : 'Save'}
              </button>
              <button
                className="btn btn--ghost btn--sm"
                onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Link copied!'); }}
              >
                <Share2 size={16} /> Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className="job-detail-grid">
          {/* Left - Description */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 20 }}>Job Overview</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 8 }}>
                {[
                  { icon: <Briefcase size={18} />, label: 'Job Type', val: jobTypeLabel },
                  { icon: <DollarSign size={18} />, label: 'Salary', val: formatSalary(job.salary_min, job.salary_max) },
                  { icon: <MapPin size={18} />, label: 'Location', val: job.location },
                  { icon: <CalendarDays size={18} />, label: 'Deadline', val: job.deadline ? formatDate(job.deadline) : 'Open ended' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--primary-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{item.label}</div>
                      <div style={{ fontWeight: 600, color: 'var(--gray-800)', fontSize: 'var(--text-sm)' }}>{item.val}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 16 }}>Job Description</h2>
              <div
                style={{ color: 'var(--gray-700)', lineHeight: 1.8, fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap' }}
              >
                {job.description}
              </div>
            </div>

            {job.skills?.length > 0 && (
              <div className="card">
                <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 16 }}>Required Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                  {job.skills.map((skill) => (
                    <span key={skill} className="tag" style={{ padding: '6px 14px', fontSize: 'var(--text-sm)' }}>
                      <CheckCircle size={14} /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Apply Card */}
          <div>
            <div className="card" style={{ position: 'sticky', top: 'calc(var(--navbar-height) + 16px)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 20 }}>Apply for this position</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Salary</span>
                  <span style={{ fontWeight: 600 }}>{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Job Type</span>
                  <span className="badge badge--purple">{jobTypeLabel}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                  <span style={{ color: 'var(--gray-500)' }}>Location</span>
                  <span style={{ fontWeight: 600 }}>{job.location}</span>
                </div>
                {job.deadline && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}>
                    <span style={{ color: 'var(--gray-500)' }}>Apply By</span>
                    <span style={{ fontWeight: 600, color: isExpired ? 'var(--error)' : 'var(--gray-800)' }}>
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                )}
              </div>

              {isExpired ? (
                <div className="badge badge--red" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                  Application deadline has passed
                </div>
              ) : (
                <button
                  className="btn btn--primary btn--full btn--lg"
                  onClick={handleApply}
                >
                  {isAuthenticated ? 'Apply Now' : 'Login to Apply'}
                </button>
              )}

              {!isAuthenticated && (
                <p style={{ textAlign: 'center', fontSize: 'var(--text-xs)', color: 'var(--gray-500)', marginTop: 12 }}>
                  <Link to="/register" style={{ color: 'var(--primary)' }}>Create a free account</Link> to apply
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
