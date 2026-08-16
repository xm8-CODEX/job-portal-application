// src/pages/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Briefcase, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROLES } from '../utils/constants';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const from = location.state?.from?.pathname;

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const data = await login(form);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      // Redirect to original destination or role-based dashboard
      if (from) {
        navigate(from, { replace: true });
      } else if (data.user.role === ROLES.EMPLOYER) {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      toast.error(err.friendlyMessage || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Panel */}
      <div className="auth-left">
        <div style={{ maxWidth: 440, color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: 24 }}>🚀</div>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 16, color: 'white' }}>
            Your career journey starts here.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'var(--text-lg)', lineHeight: 1.7 }}>
            Log in to access thousands of job opportunities or manage your talent pipeline.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 }}>
            {['50,000+ active job listings', 'AI-powered job matching', 'Real-time application tracking'].map((f) => (
              <div key={f} style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)' }}>
                <span style={{ color: '#34d399', flexShrink: 0 }}>✓</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-box">
          <div className="auth-logo">
            <Briefcase size={24} />
            <span>JobPortal</span>
          </div>
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="label label--required">Email address</label>
              <input
                className={`input ${errors.email ? 'error' : ''}`}
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
              />
              {errors.email && <span className="field-error"><AlertCircle size={12} />{errors.email}</span>}
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="label label--required">Password</label>
                <a href="#" style={{ fontSize: 'var(--text-xs)', color: 'var(--primary)' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  className={`input ${errors.password ? 'error' : ''}`}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="field-error"><AlertCircle size={12} />{errors.password}</span>}
            </div>

            <button
              type="submit"
              className={`btn btn--primary btn--full btn--lg ${loading ? 'btn--loading' : ''}`}
              disabled={loading}
            >
              {!loading && 'Sign In'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create one — it's free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
