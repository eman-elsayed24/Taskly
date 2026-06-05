import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../lib/cookies';
import { useAppSelector } from '../redux/hooks';

function PublicRoute() {
  const { data: user } = useAppSelector(state => state.user);

  // If user is authenticated and has user data, redirect to dashboard
  if (isAuthenticated() && user) {
    return <Navigate to="/dashboard/projects" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
