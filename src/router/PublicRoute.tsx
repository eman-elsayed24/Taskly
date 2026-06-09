import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../lib/cookies';
import { ROUTES } from '../constants/routes';

function PublicRoute() {
  if (isAuthenticated()) {
    return <Navigate to={ROUTES.PROJECTS} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
