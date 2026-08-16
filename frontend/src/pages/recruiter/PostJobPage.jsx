// src/pages/recruiter/PostJobPage.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Plus, Briefcase } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import SkillsInput from '../../components/jobs/SkillsInput';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { JOB_TYPES } from '../../utils/constants';
import * as jobService from '../../services/jobService';

export default function PostJobPage({ editJob = null }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const isEdit = !!editJob;

  const [form, setForm] = useState({
    title: editJob?.title || '',
    description: editJob?.description || '',
    location: editJob?.location || '',
    job_type: editJob?.job_type || 'full-time',
    salary_min: editJob?.salary_min || '',
    salary_max: editJob?.salary_max || '',
    skills: editJob?.skills || [],
    deadline: editJob?.deadline ? editJob.deadline.split('T')[0] : '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Job title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (form.skills.length === 0) e.skills = 'At least one skill is required';
    if (form.salary_min && form.salary_max && Number(form.salary_min) > Number(form.salary_max)) {
      e.salary_max = 'Max salary must be greater than min salary';
    }
    return e;
  };

  const set = (key, val) => {
    setForm({ ...form, [key]: val });
    setErrors((prev) => { const e = { ...prev }; delete e[key]; return e; });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        salary_min: form.salary_min ? Number(form.salary_min) : null,
        salary_max: form.salary_max ? Number(form.salary_max) : null,
        deadline: form.deadline || null,
      };

      if (isEdit) {
        await jobService.updateJob(editJob.id, payload);
        toast.success('Job updated successfully!');
      } else {
        await jobService.createJob(payload);
        toast.success('Job posted! It will be visible after admin review. 🎉');
      }
      navigate('/recruiter/jobs');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Failed to post job');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container" style={{ maxWidth: 860, padding: '40px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, marginBottom: 4 }}>
            {isEdit ? 'Edit Job Posting' : 'Post a New Job'}
          </h1>
          <p style={{ color: 'var(--gray-500)', fontSize: 'var(--text-sm)' }}>
            {isEdit
              ? 'Update the details of your job posting below.'
              : 'Fill in the details below. Your post will be reviewed before going live.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Basic Info */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 24 }}>
              <Briefcase size={18} style={{ verticalAlign: 'middle', marginRight: 8 }} />
              Basic Information
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-row form-row--2">
                <div className="form-group">
                  <label className="label label--required">Job Title</label>
                  <input
                    className={`input ${errors.title ? 'error' : ''}`}
                    placeholder="e.g. Senior React Developer"
                    value={form.title}
                    onChange={(e) => set('title', e.target.value)}
                  />
                  {errors.title && <span className="field-error"><AlertCircle size={12} />{errors.title}</span>}
                </div>
                <div className="form-group">
                  <label className="label">Company</label>
                  <input
                    className="input"
                    value={user?.company_name || user?.name || ''}
                    disabled
                    style={{ background: 'var(--gray-50)', color: 'var(--gray-500)' }}
                  />
                </div>
              </div>

              <div className="form-row form-row--2">
                <div className="form-group">
                  <label className="label label--required">Location</label>
                  <input
                    className={`input ${errors.location ? 'error' : ''}`}
                    placeholder="e.g. Bangalore, Remote, Hybrid"
                    value={form.location}
                    onChange={(e) => set('location', e.target.value)}
                  />
                  {errors.location && <span className="field-error"><AlertCircle size={12} />{errors.location}</span>}
                </div>
                <div className="form-group">
                  <label className="label label--required">Job Type</label>
                  <select
                    className="select"
                    value={form.job_type}
                    onChange={(e) => set('job_type', e.target.value)}
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="label">Job Description</label>
                <textarea
                  className={`textarea ${errors.description ? 'error' : ''}`}
                  rows={8}
                  placeholder="Describe the role, responsibilities, what the candidate will work on, and what success looks like..."
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                />
                {errors.description && <span className="field-error"><AlertCircle size={12} />{errors.description}</span>}
                <span className="field-hint">{form.description.length} characters</span>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 24 }}>
              Requirements
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="label label--required">Required Skills</label>
                <SkillsInput
                  value={form.skills}
                  onChange={(skills) => { set('skills', skills); }}
                  placeholder="Type a skill and press Enter"
                />
                {errors.skills && <span className="field-error"><AlertCircle size={12} />{errors.skills}</span>}
                <span className="field-hint">e.g. React, Node.js, PostgreSQL</span>
              </div>
            </div>
          </div>

          {/* Compensation */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, marginBottom: 24 }}>
              Compensation & Timeline
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-row form-row--2">
                <div className="form-group">
                  <label className="label">Minimum Salary (₹/year)</label>
                  <input
                    className="input"
                    type="number"
                    min={0}
                    placeholder="e.g. 600000"
                    value={form.salary_min}
                    onChange={(e) => set('salary_min', e.target.value)}
                  />
                  <span className="field-hint">Leave blank for "Not Disclosed"</span>
                </div>
                <div className="form-group">
                  <label className="label">Maximum Salary (₹/year)</label>
                  <input
                    className={`input ${errors.salary_max ? 'error' : ''}`}
                    type="number"
                    min={0}
                    placeholder="e.g. 1000000"
                    value={form.salary_max}
                    onChange={(e) => set('salary_max', e.target.value)}
                  />
                  {errors.salary_max && <span className="field-error"><AlertCircle size={12} />{errors.salary_max}</span>}
                </div>
              </div>

              <div className="form-row form-row--2">
                <div className="form-group">
                  <label className="label">Application Deadline</label>
                  <input
                    className="input"
                    type="date"
                    value={form.deadline}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => set('deadline', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate('/recruiter/jobs')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn--primary btn--lg ${submitting ? 'btn--loading' : ''}`}
              disabled={submitting}
            >
              {!submitting && (isEdit ? <><Briefcase size={18} /> Update Job</> : <><Plus size={18} /> Post Job</>)}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
