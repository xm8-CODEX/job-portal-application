// src/pages/candidate/CandidateDashboard.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, FileText, Bookmark, User, Search, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import StatusBadge from '../../components/applications/StatusBadge';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { formatDate, getInitials } from '../../utils/helpers';
import * as applicationService from '../../services/applicationService';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const { savedIds } = useSavedJobs();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await applicationService.getMyApplications();
        setApplications(data.applications || []);
      } catch {
        // silently fail on dashboard
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { icon: <FileText size={22} />, label: 'Total Applied', value: applications.length, color: '#4f46e5', bg: 'var(--primary-bg)', link: '/candidate/applications' },
    { icon: <TrendingUp size={22} />, label: 'Shortlisted', value: statusCounts.shortlisted || 0, color: '#f59e0b', bg: 'var(--warning-bg)', link: '/candidate/applications' },
    { icon: <Briefcase size={22} />, label: 'Hired', value: statusCounts.hired || 0, color: '#10b981', bg: 'var(--success-bg)', link: '/candidate/applications' },
    { icon: <Bookmark size={22} />, label: 'Saved Jobs', value: savedIds.length, color: '#3b82f6', bg: 'var(--info-bg)', link: '/candidate/saved' },
  ];

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 24px' }}>
        {/* Welcome header */}
        <div className="profile-header" style={{ marginBottom: 32 }}>
          <div className="profile-header__avatar">
            {getInitials(user?.name)}
          </div>
          <div>
            <h1 className="profile-header__name">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="profile-header__detail">{user?.email}</p>
            <p className="profile-header__detail" style={{ marginTop: 4 }}>
              {applications.length === 0
                ? 'Start your job search today'
                : `You have ${applications.length} active application${applications.length > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: 32 }}>
          {stats.map((s) => (
            <Link key={s.label} to={s.link} style={{ textDecoration: 'none' }}>
              <div className="stat-card" style={{ transition: 'all 0.2s' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Recent Applications */}
          <div className="card">
            <div className="flex-between" style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Recent Applications</h2>
              <Link to="/candidate/applications" className="btn btn--ghost btn--sm">
                View All <ChevronRight size={14} />
              </Link>
            </div>
            {loading ? (
              <Spinner size="sm" />
            ) : applications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--gray-400)' }}>
                <FileText size={40} style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: 'var(--text-sm)' }}>No applications yet</p>
                <Link to="/jobs" className="btn btn--primary btn--sm" style={{ marginTop: 12 }}>
                  Browse Jobs
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {applications.slice(0, 5).map((app) => (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Briefcase size={16} color="var(--primary)" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {app.Job?.title || 'Job Position'}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>{formatDate(app.createdAt)}</div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ flex: 1 }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 16 }}>Quick Actions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: <Search size={18} />, label: 'Search for Jobs', desc: 'Browse all open positions', to: '/jobs', color: 'var(--primary)', bg: 'var(--primary-bg)' },
                  { icon: <User size={18} />, label: 'Update Profile', desc: 'Add skills and experience', to: '/candidate/profile', color: 'var(--success)', bg: 'var(--success-bg)' },
                  { icon: <Bookmark size={18} />, label: 'View Saved Jobs', desc: `${savedIds.length} jobs saved`, to: '/candidate/saved', color: '#f59e0b', bg: 'var(--warning-bg)' },
                  { icon: <FileText size={18} />, label: 'My Applications', desc: `${applications.length} submitted`, to: '/candidate/applications', color: 'var(--info)', bg: 'var(--info-bg)' },
                ].map((a) => (
                  <Link
                    key={a.label}
                    to={a.to}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '12px 16px', borderRadius: 10, border: '1px solid var(--gray-200)',
                      textDecoration: 'none', transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = a.bg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--gray-200)'; e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color, flexShrink: 0 }}>
                      {a.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--gray-800)' }}>{a.label}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>{a.desc}</div>
                    </div>
                    <ChevronRight size={16} color="var(--gray-400)" style={{ marginLeft: 'auto' }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
