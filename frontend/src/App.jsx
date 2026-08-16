// src/App.jsx
// Central router – all routes live here for easy navigation and maintenance.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Auth guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Job pages (public)
import JobListPage from './pages/jobs/JobListPage';
import JobDetailPage from './pages/jobs/JobDetailPage';

// Candidate pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import SavedJobs from './pages/candidate/SavedJobs';
import CandidateProfile from './pages/candidate/CandidateProfile';
import ApplyJobPage from './pages/candidate/ApplyJobPage';

// Recruiter pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJobPage from './pages/recruiter/PostJobPage';
import ManageJobs from './pages/recruiter/ManageJobs';
import EditJobPage from './pages/recruiter/EditJobPage';
import JobApplications from './pages/recruiter/JobApplications';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

import './index.css';
import './App.css';

// Smart redirect when user is already logged in
function AuthRedirect({ children }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    const dest = user?.role === 'employer' ? '/recruiter/dashboard' : '/candidate/dashboard';
    return <Navigate to={dest} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* ── Public ─────────────────────────────────────── */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Auth — redirect if already logged in */}
            <Route
              path="/login"
              element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              }
            />
            <Route
              path="/register"
              element={
                <AuthRedirect>
                  <RegisterPage />
                </AuthRedirect>
              }
            />

            {/* ── Jobs (public browse) ─────────────────────── */}
            <Route path="/jobs" element={<JobListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* ── Candidate (seeker role) ──────────────────── */}
            <Route
              path="/jobs/:id/apply"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="seeker">
                    <ApplyJobPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="seeker">
                    <CandidateDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/applications"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="seeker">
                    <MyApplications />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/saved"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="seeker">
                    <SavedJobs />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/candidate/profile"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="seeker">
                    <CandidateProfile />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* ── Recruiter (employer role) ────────────────── */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="employer">
                    <RecruiterDashboard />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/post-job"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="employer">
                    <PostJobPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            {/* Also accessible from Navbar "Post a Job" link */}
            <Route path="/post-job" element={<Navigate to="/recruiter/post-job" replace />} />

            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="employer">
                    <ManageJobs />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/edit"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="employer">
                    <EditJobPage />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:jobId/applications"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="employer">
                    <JobApplications />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/profile"
              element={
                <ProtectedRoute>
                  <RoleRoute roles="employer">
                    <RecruiterProfile />
                  </RoleRoute>
                </ProtectedRoute>
              }
            />

            {/* ── 404 ─────────────────────────────────────── */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
