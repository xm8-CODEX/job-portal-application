// src/components/jobs/JobFilters.jsx

import { JOB_TYPES, SALARY_RANGES } from '../../utils/constants';

export default function JobFilters({ filters, onChange, onReset }) {
  const handle = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <div className="filters-panel">
      <div className="filters-panel__title">
        <span>Filters</span>
        <button
          className="btn btn--ghost btn--sm"
          onClick={onReset}
          style={{ fontSize: 'var(--text-xs)' }}
        >
          Reset All
        </button>
      </div>

      {/* Job Type */}
      <div className="filters-panel__section">
        <div className="filters-panel__section-title">Job Type</div>
        {JOB_TYPES.map((type) => (
          <label
            key={type.value}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 0', cursor: 'pointer', fontSize: 'var(--text-sm)',
              color: 'var(--gray-700)',
            }}
          >
            <input
              type="radio"
              name="job_type"
              value={type.value}
              checked={filters.jobType === type.value}
              onChange={() => handle('jobType', type.value)}
              style={{ accentColor: 'var(--primary)' }}
            />
            {type.label}
          </label>
        ))}
        {filters.jobType && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => handle('jobType', '')}
            style={{ marginTop: 4 }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Salary Range */}
      <div className="filters-panel__section">
        <div className="filters-panel__section-title">Salary Range</div>
        <select
          className="select"
          value={filters.salaryRange || ''}
          onChange={(e) => handle('salaryRange', e.target.value)}
        >
          {SALARY_RANGES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {/* Experience */}
      <div className="filters-panel__section">
        <div className="filters-panel__section-title">Experience (Years)</div>
        {['0', '1', '2', '3', '5', '8'].map((val) => {
          const labels = { '0': 'Fresher', '1': '1+', '2': '2+', '3': '3+', '5': '5+', '8': '8+' };
          return (
            <label
              key={val}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '6px 0', cursor: 'pointer', fontSize: 'var(--text-sm)',
                color: 'var(--gray-700)',
              }}
            >
              <input
                type="radio"
                name="experience"
                value={val}
                checked={filters.experience === val}
                onChange={() => handle('experience', val)}
                style={{ accentColor: 'var(--primary)' }}
              />
              {labels[val]} years
            </label>
          );
        })}
        {filters.experience && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => handle('experience', '')}
            style={{ marginTop: 4 }}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
