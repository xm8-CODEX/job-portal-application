// src/pages/RegisterPage.jsx

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Briefcase, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ROLES } from '../utils/constants';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  const toast = useToast();

  const [role, setRole] = useState(searchParams.get('role') === 'employer' ? 'employer' : 'seeker');
  const [form, setForm] = useState({ name: '', email: '', password: '', company_name: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'employer' || r === 'seeker') setRole(r);
  }, [searchParams]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (role === 'employer' && !form.company_name.trim()) {
      e.company_name = 'Company name is required for employers';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = { ...form, role };
      if (role !== 'employer') delete payload.company_name;
      const data = await register(payload);
      toast.success(`Account created! Welcome, ${data.user.name.split(' ')[0]}!`);
      if (data.user.role === ROLES.EMPLOYER) {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      toast.error(err.friendlyMessage || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div style={{ maxWidth: 440, color: 'white' }}>
          <div style={{ fontSize: '3rem', marginBottom: 24 }}>🎯</div>
          <h1 style={{ fontSize: 'var(--text-4xl)', fontWeight: 800, marginBottom: 16, color: 'white' }}>
            Join 2 million+ professionals
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 'var(--text-lg)', lineHeight: 1.7 }}>
            Whether you're hiring or looking for your next role, JobPortal has you covered.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 40 }}>
            {[
              { emoji: '🚀', text: 'Get discovered by top companies' },
              { emoji: '🤖', text: 'AI matches you to the right roles' },
              { emoji: '📬', text: 'Track applications in real-time' },
            ].map((f) => (
              <div key={f.text} style={{ display: 'flex', gap: 12, alignItems: 'center', color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)' }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{f.emoji}</span>
                {f.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-box" style={{ maxWidth: 480 }}>
          <div className="auth-logo">
            <Briefcase size={24} />
            <span>JobPortal</span>
          </div>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Free forever. No credit card required.</p>

          {/* Role selector */}
          <div className="role-selector">
            <div
              className={`role-option ${role === 'seeker' ? 'active' : ''}`}
              onClick={() => setRole('seeker')}
            >
              <div className="role-option__icon">🔎</div>
              <div className="role-option__label">Job Seeker</div>
            </div>
            <div
              className={`role-option ${role === 'employer' ? 'active' : ''}`}
              onClick={() => setRole('employer')}
            >
              <div className="role-option__icon">👨‍💼</div>
              <div className="role-option__label">Employer</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="label label--required">Full Name</label>
              <input
                className={`input ${errors.name ? 'error' : ''}`}
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoComplete="name"
              />
              {errors.name && <span className="field-error"><AlertCircle size={12} />{errors.name}</span>}
            </div>

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

            {role === 'employer' && (
              <div className="form-group">
                <label className="label label--required">Company Name</label>
                <input
                  className={`input ${errors.company_name ? 'error' : ''}`}
                  type="text"
                  placeholder="Acme Corporation"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                />
                {errors.company_name && <span className="field-error"><AlertCircle size={12} />{errors.company_name}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="label label--required">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className={`input ${errors.password ? 'error' : ''}`}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
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

            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)', lineHeight: 1.6 }}>
              By creating an account, you agree to our{' '}
              <a href="#" style={{ color: 'var(--primary)' }}>Terms of Service</a> and{' '}
              <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>.
            </p>

            <button
              type="submit"
              className={`btn btn--primary btn--full btn--lg ${loading ? 'btn--loading' : ''}`}
              disabled={loading}
            >
              {!loading && `Create ${role === 'employer' ? 'Employer' : 'Job Seeker'} Account`}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
