// src/pages/candidate/CandidateProfile.jsx

import { useState, useEffect } from 'react';
import { User, Save, Upload, FileText, AlertCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SkillsInput from '../../components/jobs/SkillsInput';
import Spinner from '../../components/ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getInitials } from '../../utils/helpers';
import * as authService from '../../services/authService';

export default function CandidateProfile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: '',
    skills: [],
    experience_years: 0,
    education: '',
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load profile from /api/auth/me which includes profile for seekers
    (async () => {
      try {
        const data = await authService.getMe();
        if (data.user?.Profile) {
          const p = data.user.Profile;
          setForm({
            name: data.user.name || '',
            bio: p.bio || '',
            skills: p.skills || [],
            experience_years: p.experience_years || 0,
            education: p.education || '',
          });
          setCurrentResume(p.resume_url || null);
        } else {
          setForm((f) => ({ ...f, name: data.user?.name || '' }));
        }
      } catch {
        // use existing data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authService.updateProfile({
        bio: form.bio,
        skills: form.skills,
        experience_years: Number(form.experience_years),
        education: form.education,
      });
      updateUser({ ...user, name: form.name });
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    try {
      const data = await authService.uploadResume(resumeFile);
      setCurrentResume(data.resume_url || data.profile?.resume_url);
      setResumeFile(null);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to upload resume');
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) return <Layout><Spinner text="Loading profile…" /></Layout>;

  return (
    <Layout>
      <div className="container" style={{ padding: '40px 24px', maxWidth: 860 }}>
        {/* Header */}
        <div className="profile-header" style={{ marginBottom: 32 }}>
          <div className="profile-header__avatar">{getInitials(user?.name)}</div>
          <div>
            <h1 className="profile-header__name">{user?.name}</h1>
            <p className="profile-header__detail">{user?.email}</p>
            <p className="profile-header__detail" style={{ marginTop: 4 }}>Job Seeker</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Profile Form */}
          <div>
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 24 }}>
                <User size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Personal Information
              </h2>
              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="label">Full Name</label>
                  <input
                    className="input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Professional Bio</label>
                  <textarea
                    className="textarea"
                    rows={4}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="A brief introduction about yourself, your experience and goals..."
                  />
                </div>

                <div className="form-group">
                  <label className="label">Education</label>
                  <input
                    className="input"
                    value={form.education}
                    onChange={(e) => setForm({ ...form, education: e.target.value })}
                    placeholder="B.Tech in Computer Science, XYZ University"
                  />
                </div>

                <div className="form-group">
                  <label className="label">Years of Experience</label>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    max={50}
                    step={0.5}
                    value={form.experience_years}
                    onChange={(e) => setForm({ ...form, experience_years: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="label">Skills</label>
                  <SkillsInput
                    value={form.skills}
                    onChange={(skills) => setForm({ ...form, skills })}
                    placeholder="Type a skill and press Enter"
                  />
                  <span className="field-hint">Press Enter or comma to add a skill</span>
                </div>

                <button
                  type="submit"
                  className={`btn btn--primary ${saving ? 'btn--loading' : ''}`}
                  disabled={saving}
                >
                  {!saving && <><Save size={16} /> Save Profile</>}
                </button>
              </form>
            </div>
          </div>

          {/* Resume Manager */}
          <div>
            <div className="card">
              <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 20 }}>
                <FileText size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                Resume Management
              </h2>

              {currentResume && (
                <div style={{ padding: 16, background: 'var(--success-bg)', borderRadius: 10, marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
                  <FileText size={24} color="var(--success)" />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--success)' }}>Current Resume</p>
                    <a
                      href={currentResume}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: 'var(--text-xs)', color: 'var(--success)', textDecoration: 'underline' }}
                    >
                      View / Download
                    </a>
                  </div>
                </div>
              )}

              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', marginBottom: 20, lineHeight: 1.6 }}>
                Upload your resume once and it will automatically be used when you apply for jobs.
                You can also upload a custom resume per application.
              </p>

              <label
                style={{
                  border: '2px dashed var(--gray-300)', borderRadius: 12,
                  padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 12, cursor: 'pointer',
                  background: resumeFile ? 'var(--success-bg)' : 'var(--gray-50)',
                  borderColor: resumeFile ? 'var(--success)' : 'var(--gray-300)',
                }}
              >
                {resumeFile ? (
                  <>
                    <FileText size={32} color="var(--success)" />
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--success)' }}>{resumeFile.name}</span>
                  </>
                ) : (
                  <>
                    <Upload size={32} color="var(--gray-400)" />
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--gray-700)' }}>
                      {currentResume ? 'Replace Resume' : 'Upload Resume'}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-400)' }}>PDF, DOC, DOCX — Max 5MB</span>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={(e) => setResumeFile(e.target.files[0] || null)}
                />
              </label>

              {resumeFile && (
                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button
                    className="btn btn--ghost btn--sm"
                    onClick={() => setResumeFile(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className={`btn btn--primary ${uploadingResume ? 'btn--loading' : ''}`}
                    onClick={handleResumeUpload}
                    disabled={uploadingResume}
                    style={{ flex: 1 }}
                  >
                    {!uploadingResume && <><Upload size={16} /> Upload Resume</>}
                  </button>
                </div>
              )}

              {/* Skill preview */}
              {form.skills.length > 0 && (
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--gray-200)' }}>
                  <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Your Skills
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {form.skills.map((s) => (
                      <span key={s} className="tag">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
