// src/components/layout/Navbar.jsx

import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { ROLES } from '../../utils/constants';
import {
  Briefcase, Menu, X, ChevronDown, User, LogOut,
  LayoutDashboard, FileText, Bookmark, Settings, Users,
} from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handle(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const dashboardPath =
    user?.role === ROLES.EMPLOYER
      ? '/recruiter/dashboard'
      : user?.role === ROLES.SEEKER
      ? '/candidate/dashboard'
      : '/';

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/jobs', label: 'Find Jobs' },
    { to: '/post-job', label: 'Post a Job' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const userMenuItems = isAuthenticated
    ? [
        {
          icon: <LayoutDashboard size={16} />,
          label: 'Dashboard',
          action: () => navigate(dashboardPath),
        },
        user?.role === ROLES.SEEKER && {
          icon: <FileText size={16} />,
          label: 'My Applications',
          action: () => navigate('/candidate/applications'),
        },
        user?.role === ROLES.SEEKER && {
          icon: <Bookmark size={16} />,
          label: 'Saved Jobs',
          action: () => navigate('/candidate/saved'),
        },
        user?.role === ROLES.EMPLOYER && {
          icon: <Briefcase size={16} />,
          label: 'My Job Posts',
          action: () => navigate('/recruiter/jobs'),
        },
        {
          icon: <User size={16} />,
          label: 'Profile',
          action: () =>
            navigate(
              user?.role === ROLES.EMPLOYER
                ? '/recruiter/profile'
                : '/candidate/profile'
            ),
        },
        'divider',
        {
          icon: <LogOut size={16} />,
          label: 'Sign Out',
          action: handleLogout,
          danger: true,
        },
      ].filter(Boolean)
    : [];

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <Briefcase size={22} />
          <span>Job<span style={{ color: 'var(--primary)' }}>Portal</span></span>
        </Link>

        {/* Desktop Nav */}
        <nav className={`navbar__nav ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'active' : ''}`
              }
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <div className="navbar__dropdown" ref={dropdownRef}>
              <button
                className="navbar__user"
                onClick={() => setDropdownOpen((v) => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <div className="navbar__avatar">{getInitials(user?.name)}</div>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--gray-700)' }} className="hide-mobile">
                  {user?.name?.split(' ')[0]}
                </span>
                <ChevronDown size={14} color="var(--gray-500)" className="hide-mobile" />
              </button>
              {dropdownOpen && (
                <div className="navbar__dropdown-menu">
                  <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--gray-200)' }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--gray-900)' }}>{user?.name}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', textTransform: 'capitalize' }}>{user?.role}</div>
                  </div>
                  {userMenuItems.map((item, i) =>
                    item === 'divider' ? (
                      <div key={i} className="navbar__dropdown-divider" />
                    ) : (
                      <button
                        key={i}
                        className={`navbar__dropdown-item ${item.danger ? 'navbar__dropdown-item--danger' : ''}`}
                        onClick={() => { item.action(); setDropdownOpen(false); }}
                      >
                        {item.icon}
                        {item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn--ghost btn--sm">Login</Link>
              <Link to="/register" className="btn btn--primary btn--sm">Register</Link>
            </>
          )}

          {/* Hamburger */}
          <button
            className="navbar__hamburger"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>
    </header>
  );
}
