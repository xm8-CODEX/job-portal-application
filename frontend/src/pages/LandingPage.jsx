// src/pages/LandingPage.jsx

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Users, TrendingUp, Star, CheckCircle, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import Layout from '../components/layout/Layout';

const FEATURED_CATEGORIES = [
  { icon: '💻', label: 'Technology', count: '1.2K jobs' },
  { icon: '📊', label: 'Finance', count: '450 jobs' },
  { icon: '🎨', label: 'Design', count: '320 jobs' },
  { icon: '📢', label: 'Marketing', count: '580 jobs' },
  { icon: '🏥', label: 'Healthcare', count: '890 jobs' },
  { icon: '📚', label: 'Education', count: '270 jobs' },
  { icon: '⚙️', label: 'Engineering', count: '740 jobs' },
  { icon: '📦', label: 'Operations', count: '310 jobs' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    if (location) params.set('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <Layout>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero__content">
            <div className="hero__badge">
              <Zap size={14} />
              <span>India's fastest growing job platform</span>
            </div>
            <h1 className="hero__title">
              Find Your <span>Next Opportunity</span>
            </h1>
            <p className="hero__subtitle">
              Connect talented people with the right opportunities.
              Thousands of jobs from top companies — updated daily.
            </p>

            {/* Search Bar */}
            <div className="hero__search">
              <form className="search-bar" onSubmit={handleSearch}>
                <div className="search-bar__main">
                  <div className="search-bar__field">
                    <Search size={20} />
                    <input
                      className="search-bar__input"
                      type="text"
                      placeholder="Job title, keyword, or company"
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                    />
                  </div>
                  <div className="search-bar__field">
                    <MapPin size={20} />
                    <input
                      className="search-bar__input"
                      type="text"
                      placeholder="City or remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="search-bar__btn">
                    <Search size={18} /> Search Jobs
                  </button>
                </div>
              </form>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 'var(--text-sm)', marginTop: 12, textAlign: 'center' }}>
                Popular: React Developer, Data Analyst, Product Manager, UI Designer
              </p>
            </div>

            {/* Stats */}
            <div className="hero__stats">
              {[
                { value: '50,000+', label: 'Active Jobs' },
                { value: '10,000+', label: 'Companies' },
                { value: '2M+', label: 'Job Seekers' },
                { value: '95%', label: 'Placement Rate' },
              ].map((s) => (
                <div key={s.label} className="hero__stat">
                  <div className="hero__stat-value">{s.value}</div>
                  <div className="hero__stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── I Want to Hire / I Want a Job ────────────────────── */}
      <section className="choice-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="section__badge">
              <Star size={14} /> Get Started Today
            </span>
            <h2 className="section__title">What are you looking for?</h2>
            <p className="section__subtitle">
              Whether you're hiring or job hunting — we've got you covered.
            </p>
          </div>

          <div className="choice-grid">
            {/* I Want to Hire */}
            <div
              className="choice-card choice-card--hire"
              onClick={() => navigate('/register?role=employer')}
            >
              <span className="choice-card__emoji">👨‍💼</span>
              <h3 className="choice-card__title">I Want to Hire</h3>
              <p className="choice-card__desc">
                Post jobs, discover talented candidates and manage applications — all in one place.
              </p>
              <ul style={{ textAlign: 'left', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Post unlimited job listings', 'Access AI-matched candidates', 'Manage applications easily'].map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                    <CheckCircle size={16} color="var(--primary)" /> {f}
                  </li>
                ))}
              </ul>
              <button className="btn btn--primary btn--lg btn--full">
                Post a Job <ArrowRight size={18} />
              </button>
            </div>

            {/* I Want a Job */}
            <div
              className="choice-card choice-card--seek"
              onClick={() => navigate('/register?role=seeker')}
            >
              <span className="choice-card__emoji">🔎</span>
              <h3 className="choice-card__title">I Want a Job</h3>
              <p className="choice-card__desc">
                Discover opportunities, apply for jobs and build your career with AI-matched roles.
              </p>
              <ul style={{ textAlign: 'left', marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Browse 50,000+ open roles', 'AI-powered job matching', 'Track your applications'].map((f) => (
                  <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                    <CheckCircle size={16} color="var(--success)" /> {f}
                  </li>
                ))}
              </ul>
              <button
                className="btn btn--lg btn--full"
                style={{ background: 'var(--success)', color: 'white', border: 'none' }}
              >
                Find a Job <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="section section--white">
        <div className="container">
          <div className="section__header">
            <span className="section__badge"><Briefcase size={14} /> Browse by Category</span>
            <h2 className="section__title">Explore by Industry</h2>
            <p className="section__subtitle">Find opportunities in your area of expertise</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {FEATURED_CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className="card"
                style={{ textAlign: 'center', cursor: 'pointer', padding: '28px 20px' }}
                onClick={() => navigate(`/jobs?keyword=${cat.label}`)}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{cat.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--gray-800)', marginBottom: 4 }}>
                  {cat.label}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)', fontWeight: 600 }}>
                  {cat.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────── */}
      <section className="section section--gray">
        <div className="container">
          <div className="section__header">
            <span className="section__badge"><Shield size={14} /> Why JobPortal</span>
            <h2 className="section__title">Built for Modern Hiring</h2>
            <p className="section__subtitle">Everything you need to hire faster or find jobs smarter</p>
          </div>
          <div className="features-grid">
            {[
              {
                icon: <Zap size={28} color="var(--primary)" />,
                bg: 'var(--primary-bg)',
                title: 'AI-Powered Matching',
                desc: 'Our smart algorithm connects candidates with roles that match their skills and experience for the best outcomes.',
              },
              {
                icon: <Globe size={28} color="var(--success)" />,
                bg: 'var(--success-bg)',
                title: 'Remote & Hybrid Ready',
                desc: 'Search for remote, hybrid, or on-site roles. Filter by job type, location, and salary with ease.',
              },
              {
                icon: <TrendingUp size={28} color="var(--accent)" />,
                bg: 'var(--warning-bg)',
                title: 'Real-time Application Tracking',
                desc: 'Both employers and candidates get live updates on application statuses, ensuring no one is left in the dark.',
              },
              {
                icon: <Shield size={28} color="var(--info)" />,
                bg: 'var(--info-bg)',
                title: 'Secure & Trusted',
                desc: 'All job postings are reviewed before going live. Your data is encrypted and handled with care.',
              },
              {
                icon: <Users size={28} color="#8b5cf6" />,
                bg: '#f5f3ff',
                title: 'Talent-First Approach',
                desc: 'Every decision we make prioritizes fair opportunities. Our platform fights bias with data-driven matching.',
              },
              {
                icon: <Star size={28} color="#ec4899" />,
                bg: '#fdf2f8',
                title: 'Top Companies, Top Talent',
                desc: 'From startups to Fortune 500s — find the right fit. Quality employers verified by our team.',
              },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-card__icon" style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          padding: '80px 0',
          textAlign: 'center',
        }}
      >
        <div className="container">
          <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, color: 'white', marginBottom: 16 }}>
            Ready to take the next step?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-lg)', marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            Join over 2 million professionals who use JobPortal to advance their careers.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=seeker" className="btn btn--lg" style={{ background: 'white', color: 'var(--primary)' }}>
              Get Started Free
            </Link>
            <Link to="/jobs" className="btn btn--lg" style={{ background: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.5)' }}>
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
