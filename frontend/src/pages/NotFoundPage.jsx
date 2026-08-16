// src/pages/NotFoundPage.jsx

import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div style={{ textAlign: 'center', padding: '120px 24px', flex: 1 }}>
        <div style={{ fontSize: '8rem', marginBottom: 24 }}>🧭</div>
        <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>
          404 — Page Not Found
        </h1>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--gray-500)', marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
          Looks like you've taken a wrong turn. The page you're looking for doesn't exist.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn--primary btn--lg">Go to Home</Link>
          <Link to="/jobs" className="btn btn--ghost btn--lg">Browse Jobs</Link>
        </div>
      </div>
    </Layout>
  );
}
