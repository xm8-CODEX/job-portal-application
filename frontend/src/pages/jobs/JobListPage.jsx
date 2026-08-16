// src/pages/jobs/JobListPage.jsx

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import JobCard from '../../components/jobs/JobCard';
import JobFilters from '../../components/jobs/JobFilters';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import * as jobService from '../../services/jobService';
import { parseSalaryRange } from '../../utils/helpers';

const LIMIT = 12;

export default function JobListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toggleSave, isSaved } = useSavedJobs();
  const [showFilters, setShowFilters] = useState(false);

  // Search state (synced with URL)
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  const [filters, setFilters] = useState({
    jobType: searchParams.get('jobType') || '',
    salaryRange: '',
    experience: '',
  });

  const [page, setPage] = useState(1);
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    try {
      const { minSalary, maxSalary } = parseSalaryRange(params.salaryRange);
      const data = await jobService.getJobs({
        keyword: params.keyword,
        location: params.location,
        jobType: params.jobType,
        minSalary,
        maxSalary,
        page: params.page,
        limit: LIMIT,
      });
      setJobs(data.jobs || []);
      setTotal(data.count || 0);
    } catch (err) {
      setError(err.friendlyMessage || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when params change
  useEffect(() => {
    fetchJobs({ keyword, location, ...filters, page });
  }, [keyword, location, filters, page, fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs({ keyword, location, ...filters, page: 1 });
    setSearchParams({ keyword, location, ...filters });
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleReset = () => {
    setFilters({ jobType: '', salaryRange: '', experience: '' });
    setKeyword('');
    setLocation('');
    setPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <Layout>
      {/* Search Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63)', padding: '40px 0' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 24, textAlign: 'center' }}>
            Find Your Perfect Job
          </h1>
          <form className="search-bar" onSubmit={handleSearch}>
            <div className="search-bar__main">
              <div className="search-bar__field">
                <Search size={20} />
                <input
                  className="search-bar__input"
                  placeholder="Job title, keyword, or company"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
              <div className="search-bar__field">
                <MapPin size={20} />
                <input
                  className="search-bar__input"
                  placeholder="City, state, or remote"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button type="submit" className="search-bar__btn">
                <Search size={18} /> Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container">
        {/* Results count + filter toggle */}
        <div className="flex-between" style={{ padding: '20px 0', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--gray-600)', fontSize: 'var(--text-sm)' }}>
            {loading ? 'Searching…' : `${total.toLocaleString()} job${total !== 1 ? 's' : ''} found`}
            {keyword && <> for "<strong>{keyword}</strong>"</>}
            {location && <> in <strong>{location}</strong></>}
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              className={`btn btn--ghost btn--sm ${showFilters ? 'btn--primary' : ''}`}
              onClick={() => setShowFilters((v) => !v)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <SlidersHorizontal size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            {(filters.jobType || filters.salaryRange || filters.experience || keyword || location) && (
              <button className="btn btn--ghost btn--sm" onClick={handleReset}>
                <X size={14} /> Clear All
              </button>
            )}
          </div>
        </div>

        <div className="search-layout" style={{ gridTemplateColumns: showFilters ? '280px 1fr' : '1fr', transition: 'all 0.3s' }}>
          {showFilters && (
            <div>
              <JobFilters filters={filters} onChange={handleFiltersChange} onReset={handleReset} />
            </div>
          )}

          <div>
            {loading ? (
              <Spinner text="Finding jobs for you…" />
            ) : error ? (
              <ErrorState message={error} onRetry={() => fetchJobs({ keyword, location, ...filters, page })} />
            ) : jobs.length === 0 ? (
              <EmptyState
                title="No jobs found"
                description="Try broadening your search by adjusting the keyword, location, or filters."
                action={<button className="btn btn--primary" onClick={handleReset}>Clear Filters</button>}
              />
            ) : (
              <>
                <div className="jobs-grid">
                  {jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onSave={toggleSave}
                      isSaved={isSaved(job.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination__btn"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                      return (
                        <button
                          key={p}
                          className={`pagination__btn ${p === page ? 'active' : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      );
                    })}
                    <button
                      className="pagination__btn"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
