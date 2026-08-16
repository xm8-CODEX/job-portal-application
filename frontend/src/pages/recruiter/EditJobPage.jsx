// src/pages/recruiter/EditJobPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import PostJobPage from './PostJobPage';
import Spinner from '../../components/ui/Spinner';
import ErrorState from '../../components/ui/ErrorState';
import * as jobService from '../../services/jobService';

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await jobService.getJobById(id);
        setJob(data.job);
      } catch (err) {
        setError(err.friendlyMessage || 'Job not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <Layout><Spinner text="Loading job…" /></Layout>;
  if (error) return <Layout><div className="container" style={{ padding: 48 }}><ErrorState message={error} /></div></Layout>;

  return <PostJobPage editJob={job} />;
}
