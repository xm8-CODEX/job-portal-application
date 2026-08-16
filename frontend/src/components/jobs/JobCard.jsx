// src/components/jobs/JobCard.jsx

import { Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Briefcase, CalendarDays, Bookmark } from 'lucide-react';
import { formatSalary, timeAgo, truncate } from '../../utils/helpers';
import { JOB_TYPES } from '../../utils/constants';

export default function JobCard({ job, onSave, isSaved, showApply = true, showSave = true, isRecruiterView = false }) {
  const companyLogo = job.employer?.company_name?.[0] || job.employer?.name?.[0] || '?';
  const jobTypeLabel = JOB_TYPES.find((t) => t.value === job.job_type)?.label || job.job_type;

  return (
    <div className="job-card">
      {/* Header */}
      <div className="job-card__header">
        <div className="job-card__company-logo">
          <span>{companyLogo.toUpperCase()}</span>
        </div>
        <div className="job-card__title-area">
          <h3 className="job-card__title" title={job.title}>{job.title}</h3>
          <div className="job-card__company">
            {job.employer?.company_name || job.employer?.name || 'Company'}
          </div>
        </div>
        {showSave && !isRecruiterView && (
          <button
            className={`job-card__save-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => { e.preventDefault(); onSave?.(job.id); }}
            title={isSaved ? 'Unsave' : 'Save job'}
            aria-label="Save job"
          >
            <Bookmark size={18} fill={isSaved ? 'var(--warning)' : 'none'} />
          </button>
        )}
      </div>

      {/* Meta info */}
      <div className="job-card__meta">
        <span className="job-card__meta-item">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="job-card__meta-item">
          <Briefcase size={14} /> {jobTypeLabel}
        </span>
        <span className="job-card__meta-item">
          <DollarSign size={14} /> {formatSalary(job.salary_min, job.salary_max)}
        </span>
        {job.deadline && (
          <span className="job-card__meta-item">
            <CalendarDays size={14} /> Due {timeAgo(job.deadline)}
          </span>
        )}
      </div>

      {/* Description snippet */}
      {job.description && (
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-500)', lineHeight: 1.6 }}>
          {truncate(job.description, 100)}
        </p>
      )}

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="job-card__skills">
          {job.skills.slice(0, 4).map((skill) => (
            <span key={skill} className="tag">{skill}</span>
          ))}
          {job.skills.length > 4 && (
            <span className="badge badge--gray">+{job.skills.length - 4}</span>
          )}
        </div>
      )}

      {/* AI Match Score */}
      {job.match_score != null && (
        <div>
          <span className="job-card__match-score">
            🎯 {Math.round(job.match_score * 100)}% Match
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="job-card__footer">
        <span className="job-card__posted">
          <Clock size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          {timeAgo(job.createdAt)}
        </span>
        <div className="job-card__actions">
          <Link to={`/jobs/${job.id}`} className="btn btn--ghost btn--sm">
            View Details
          </Link>
          {showApply && !isRecruiterView && (
            <Link to={`/jobs/${job.id}/apply`} className="btn btn--primary btn--sm">
              Apply Now
            </Link>
          )}
          {isRecruiterView && (
            <Link to={`/recruiter/jobs/${job.id}/applications`} className="btn btn--primary btn--sm">
              View Applicants
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
