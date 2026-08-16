// src/pages/recruiter/RecruiterProfile.jsx

import { useState } from 'react';
import { Save, Building } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/helpers';

export default function RecruiterProfile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    name: user?.name || '',
    company_name: user?.company_name || '',
    email: user?.email || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // In a full implementation, this would call a PATCH /api/auth/profile endpoint
      updateUser({ ...user, ...form });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 24px', maxWidth: 720 }}>
        <div className="profile-header" style={{ marginBottom: 32, background: 'linear-gradient(135deg, #1e1b4b, #3730a3)' }}>
          <div className="profile-header__avatar">{getInitials(user?.name)}</div>
          <div>
            <h1 className="profile-header__name">{user?.name}</h1>
            <p className="profile-header__detail">{user?.company_name}</p>
            <p className="profile-header__detail" style={{ marginTop: 4 }}>Recruiter Account</p>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 24 }}>
            <Building size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Company & Recruiter Details
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-row form-row--2">
              <div className="form-group">
                <label className="label">Full Name</label>
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="label">Company Name</label>
                <input
                  className="input"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  placeholder="Your company name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Email Address</label>
              <input
                className="input"
                type="email"
                value={form.email}
                disabled
                style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }}
              />
              <span className="field-hint">Email cannot be changed.</span>
            </div>

            <div className="form-group">
              <label className="label">Account Role</label>
              <input
                className="input"
                value="Employer / Recruiter"
                disabled
                style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="submit"
                className={`btn btn--primary ${saving ? 'btn--loading' : ''}`}
                disabled={saving}
              >
                {!saving && <><Save size={16} /> Save Changes</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
