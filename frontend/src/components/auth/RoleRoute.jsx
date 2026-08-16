// src/components/auth/RoleRoute.jsx
// Allows access only to users with the specified role(s).
// Redirects to the appropriate dashboard if a different role tries to access.

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function RoleRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const allowed = Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;

  if (!allowed) {
    // Redirect to the user's correct dashboard
    if (user.role === 'seeker') return <Navigate to="/candidate/dashboard" replace />;
    if (user.role === 'employer') return <Navigate to="/recruiter/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}
