// src/pages/candidate/ApplyJobPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, AlertCircle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Spinner from '../../components/ui/Spinner';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import * as jobService from '../../services/jobService';
import * as applicationService from '../../services/applicationService';

export default function ApplyJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { user } = useAuth();

  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [coverNote, setCoverNote] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await jobService.getJobById(id);
        setJob(data.job);
      } catch {
        toast.error('Job not found');
        navigate('/jobs');
      } finally {
        setLoadingJob(false);
      }
    })();
  }, [id]);

  const validate = () => {
    const e = {};
    if (!coverNote.trim()) e.coverNote = 'Cover note is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await applicationService.applyToJob(id, {
        cover_note: coverNote,
        resumeFile: resumeFile || undefined,
      });
      toast.success('Application submitted successfully! 🎉');
      navigate('/candidate/applications');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) return <Layout><Spinner text="Loading job…" /></Layout>;

  return (
    <Layout>
      <div className="container" style={{ maxWidth: 720, padding: '40px 24px' }}>
        <Link
          to={`/jobs/${id}`}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gray-500)', fontSize: 'var(--text-sm)', marginBottom: 24 }}
        >
          <ArrowLeft size={16} /> Back to job details
        </Link>

        <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
          <div
            style={{
              width: 52, height: 52, borderRadius: 12,
              background: 'linear-gradient(135deg, var(--primary-bg), var(--primary))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', flexShrink: 0,
            }}
          >
            {(job?.employer?.company_name || '?')[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700 }}>{job?.title}</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
              {job?.employer?.company_name || job?.employer?.name} • {job?.location}
            </p>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, marginBottom: 8 }}>Submit Your Application</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)', marginBottom: 28 }}>
            Applying as <strong>{user?.name}</strong> ({user?.email})
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Cover Note */}
            <div className="form-group">
              <label className="label label--required">Cover Note</label>
              <textarea
                className={`textarea ${errors.coverNote ? 'error' : ''}`}
                rows={6}
                placeholder="Tell the employer why you're a great fit for this role. Highlight your relevant skills and experience..."
                value={coverNote}
                onChange={(e) => { setCoverNote(e.target.value); setErrors({}); }}
              />
              {errors.coverNote && <span className="field-error"><AlertCircle size={12} />{errors.coverNote}</span>}
              <span className="field-hint">{coverNote.length}/2000 characters</span>
            </div>

            {/* Resume Upload */}
            <div className="form-group">
              <label className="label">Resume (Optional — uses your profile resume if not provided)</label>
              <label
                style={{
                  border: '2px dashed var(--gray-300)', borderRadius: 'var(--radius)',
                  padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 12, cursor: 'pointer', transition: 'all 0.2s', background: resumeFile ? 'var(--success-bg)' : 'var(--gray-50)',
                  borderColor: resumeFile ? 'var(--success)' : 'var(--gray-300)',
                }}
              >
                {resumeFile ? (
                  <>
                    <FileText size={32} color="var(--success)" />
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--success)' }}>
                      {resumeFile.name}
                    </span>
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      onClick={(e) => { e.preventDefault(); setResumeFile(null); }}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <Upload size={32} color="var(--gray-400)" />
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--gray-700)' }}>
                      Drop your resume here, or click to browse
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--gray-500)' }}>
                      PDF, DOC, DOCX — Max 5MB
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  hidden
                  onChange={(e) => setResumeFile(e.target.files[0] || null)}
                />
              </label>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => navigate(`/jobs/${id}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn--primary btn--lg ${submitting ? 'btn--loading' : ''}`}
                disabled={submitting}
                style={{ flex: 1 }}
              >
                {!submitting && 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
