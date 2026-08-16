// src/pages/AboutPage.jsx

import Layout from '../components/layout/Layout';
import { Users, Zap, Shield, Globe, Target, Heart } from 'lucide-react';

const TEAM = [
  { name: 'Aditya Sharma', role: 'CEO & Co-Founder', emoji: '👨‍💻' },
  { name: 'Priya Singh', role: 'CTO & Co-Founder', emoji: '👩‍💻' },
  { name: 'Rahul Verma', role: 'Head of Product', emoji: '🎯' },
  { name: 'Sneha Patel', role: 'Head of Engineering', emoji: '⚙️' },
];

export default function AboutPage() {
  return (
    <Layout>
      {/* Hero */}
      <div className="about-hero">
        <div className="container">
          <span className="section__badge" style={{ background: 'rgba(79,70,229,0.3)', color: '#a5b4fc', borderColor: 'rgba(129,140,248,0.3)' }}>
            Our Story
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, color: 'white', marginBottom: 20, marginTop: 16 }}>
            Building the future of work
          </h1>
          <p style={{ fontSize: 'var(--text-lg)', color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto' }}>
            JobPortal was founded with one simple mission: to make hiring and job seeking radically more efficient, fair, and human.
          </p>
        </div>
      </div>

      {/* Mission */}
      <section className="section section--white">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <span className="section__badge"><Target size={14} /> Our Mission</span>
              <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginTop: 16, marginBottom: 20 }}>
                Connecting talent with opportunity
              </h2>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, marginBottom: 20, fontSize: 'var(--text-base)' }}>
                We believe that everyone deserves a fulfilling career, and every company deserves to find the right person.
                Our platform uses AI-powered matching to make that connection faster and smarter.
              </p>
              <p style={{ color: 'var(--gray-500)', lineHeight: 1.8, fontSize: 'var(--text-base)' }}>
                We're committed to removing bias from hiring, providing transparent application processes,
                and giving both seekers and employers the tools they need to make great decisions.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                { icon: <Zap size={24} color="var(--primary)" />, bg: 'var(--primary-bg)', title: 'Fast Matching', desc: 'AI-powered recommendations' },
                { icon: <Shield size={24} color="var(--success)" />, bg: 'var(--success-bg)', title: 'Trusted Platform', desc: 'Verified companies' },
                { icon: <Globe size={24} color="var(--info)" />, bg: 'var(--info-bg)', title: 'Remote-First', desc: 'Work from anywhere' },
                { icon: <Heart size={24} color="#ec4899" />, bg: '#fdf2f8', title: 'People First', desc: 'Built for humans' },
              ].map((v) => (
                <div key={v.title} style={{ padding: 24, background: v.bg, borderRadius: 16, textAlign: 'center' }}>
                  <div style={{ marginBottom: 12 }}>{v.icon}</div>
                  <h4 style={{ fontWeight: 700, fontSize: 'var(--text-sm)', marginBottom: 4 }}>{v.title}</h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section section--gray">
        <div className="container">
          <div className="stats-grid">
            {[
              { value: '2M+', label: 'Active Users', desc: 'Job seekers on our platform' },
              { value: '50K+', label: 'Job Listings', desc: 'Open positions daily' },
              { value: '10K+', label: 'Companies', desc: 'Verified employers' },
              { value: '95%', label: 'Success Rate', desc: 'Placements within 90 days' },
            ].map((s) => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: 8 }}>{s.value}</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section section--white">
        <div className="container">
          <div className="section__header">
            <span className="section__badge"><Users size={14} /> Our Team</span>
            <h2 className="section__title">Meet the Team</h2>
            <p className="section__subtitle">The people building the future of work</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {TEAM.map((t) => (
              <div key={t.name} className="card" style={{ textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: '3rem', marginBottom: 16 }}>{t.emoji}</div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{t.name}</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)', fontWeight: 600 }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
