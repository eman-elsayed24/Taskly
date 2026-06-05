import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../lib/cookies';

function PublicRoute() {
  // If user has valid token, redirect to dashboard
  if (isAuthenticated()) {
    return <Navigate to="/dashboard/projects" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
