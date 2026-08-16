// src/pages/recruiter/RecruiterDashboard.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, TrendingUp, Plus, Eye, ChevronRight, Clock } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { getInitials, timeAgo } from '../../utils/helpers';
import { JOB_STATUSES } from '../../utils/constants';
import * as jobService from '../../services/jobService';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await jobService.getMyJobs();
        setJobs(data.jobs || []);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { icon: <Briefcase size={22} />, label: 'Total Posts', value: jobs.length, color: 'var(--primary)', bg: 'var(--primary-bg)', link: '/recruiter/jobs' },
    { icon: <TrendingUp size={22} />, label: 'Active Jobs', value: statusCounts.approved || 0, color: 'var(--success)', bg: 'var(--success-bg)', link: '/recruiter/jobs' },
    { icon: <Clock size={22} />, label: 'Pending Review', value: statusCounts.pending || 0, color: '#f59e0b', bg: 'var(--warning-bg)', link: '/recruiter/jobs' },
    { icon: <Users size={22} />, label: 'Applications', value: '—', color: 'var(--info)', bg: 'var(--info-bg)', link: '/recruiter/jobs' },
  ];

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Welcome */}
        <div className="profile-header" style={{ marginBottom: 32, background: 'linear-gradient(135deg, #1e1b4b, #3730a3)' }}>
          <div className="profile-header__avatar">
            {getInitials(user?.name)}
          </div>
          <div>
            <h1 className="profile-header__name">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="profile-header__detail">{user?.company_name || 'Your Company'}</p>
            <p className="profile-header__detail" style={{ marginTop: 4 }}>{user?.email}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Link to="/recruiter/post-job" className="btn btn--lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Plus size={18} /> Post a Job
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 32 }}>
          {stats.map((s) => (
            <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
              <div className="stat-card">
                <div className="stat-card__icon" style={{ background: s.bg, color: s.color }}>
                  {s.icon}
                </div>
                <div>
                  <div className="stat-card__value">{s.value}</div>
                  <div className="stat-card__label">{s.label}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Recent Jobs */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Your Job Posts</h2>
              <Link to="/recruiter/jobs" className="btn btn--ghost btn--sm">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            {loading ? (
              <Spinner size="sm" />
            ) : jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-400)' }}>
                <Briefcase size={40} style={{ margin: '0 auto 12px' }} />
                <p style={{ marginBottom: 12 }}>No job posts yet</p>
                <Link to="/recruiter/post-job" className="btn btn--primary btn--sm">
                  <Plus size={14} /> Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Status</th>
                      <th>Posted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.slice(0, 8).map((job) => {
                      const statusConfig = JOB_STATUSES[job.status] || { label: job.status, color: 'gray' };
                      return (
                        <tr key={job.id}>
                          <td>
                            <div style={{ fontWeight: 600 }}>{job.title}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>{job.location}</div>
                          </td>
                          <td>
                            <span className={`badge badge--${statusConfig.color}`}>
                              {statusConfig.label}
                            </span>
                          </td>
                          <td style={{ color: 'var(--gray-500)', fontSize: 'var(--text-xs)' }}>
                            {timeAgo(job.createdAt)}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <Link to={`/jobs/${job.id}`} className="btn btn--ghost btn--sm" title="View">
                                <Eye size={14} />
                              </Link>
                              <Link to={`/recruiter/jobs/${job.id}/applications`} className="btn btn--primary btn--sm" title="View Applicants">
                                <Users size={14} />
                              </Link>
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

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: <Plus size={18} />, label: 'Post a New Job', to: '/recruiter/post-job', color: 'var(--primary)', bg: 'var(--primary-bg)' },
                  { icon: <Briefcase size={18} />, label: 'Manage Jobs', to: '/recruiter/jobs', color: 'var(--success)', bg: 'var(--success-bg)' },
                  { icon: <Users size={18} />, label: 'View Applications', to: '/recruiter/jobs', color: '#f59e0b', bg: 'var(--warning-bg)' },
                ].map((a) => (
                  <Link
                    key={a.label}
                    to={a.to}
                    className="btn btn--ghost"
                    style={{ justifyContent: 'flex-start', gap: 12, padding: '12px 16px' }}
                  >
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color, flexShrink: 0 }}>
                      {a.icon}
                    </div>
                    {a.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Status legend */}
            <div className="card">
              <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, marginBottom: 12, color: 'var(--gray-700)' }}>Job Status Guide</h3>
              {Object.entries(JOB_STATUSES).map(([key, val]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className={`badge badge--${val.color}`}>{val.label}</span>
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                    {key === 'pending' && '— Awaiting admin review'}
                    {key === 'approved' && '— Visible to all seekers'}
                    {key === 'rejected' && '— Not approved'}
                    {key === 'closed' && '— No longer accepting'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
