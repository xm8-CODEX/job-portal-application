// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

const socialLinks = [
  { label: 'X', href: '#', title: 'Twitter / X' },
  { label: 'in', href: '#', title: 'LinkedIn' },
  { label: 'gh', href: '#', title: 'GitHub' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div>
            <div className="footer__brand-name" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Briefcase size={20} />
              JobPortal
            </div>
            <p className="footer__desc">
              Connecting talented professionals with the companies that need them.
              Find your dream job or hire the perfect candidate today.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  title={s.title}
                  style={{
                    width: 36, height: 36, background: 'rgba(255,255,255,0.08)',
                    borderRadius: 8, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'var(--gray-400)',
                    transition: 'all 0.2s', fontSize: 12, fontWeight: 700,
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'white'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--gray-400)'; }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Job Seekers */}
          <div>
            <h4 className="footer__col-title">For Job Seekers</h4>
            <ul className="footer__links">
              {[
                { to: '/jobs', label: 'Browse Jobs' },
                { to: '/register', label: 'Create Account' },
                { to: '/candidate/dashboard', label: 'Dashboard' },
                { to: '/candidate/applications', label: 'My Applications' },
                { to: '/candidate/saved', label: 'Saved Jobs' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="footer__link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="footer__col-title">For Employers</h4>
            <ul className="footer__links">
              {[
                { to: '/post-job', label: 'Post a Job' },
                { to: '/register', label: 'Create Account' },
                { to: '/recruiter/dashboard', label: 'Dashboard' },
                { to: '/recruiter/jobs', label: 'Manage Jobs' },
                { to: '/recruiter/profile', label: 'Company Profile' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="footer__link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="footer__col-title">Company</h4>
            <ul className="footer__links">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '#', label: 'Privacy Policy' },
                { to: '#', label: 'Terms of Service' },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="footer__link">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} JobPortal. All rights reserved.</span>
          <span style={{ color: 'var(--gray-600)' }}>Built with ❤️ for job seekers & employers</span>
        </div>
      </div>
    </footer>
  );
}
