import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import AuthLayout from '../components/auth/AuthLayout';
import DashboardLayout from '../components/dashboard/layout/DashboardLayout';
import Projects from '../pages/dashboard/Projects';
import ProjectEpics from '../pages/dashboard/ProjectEpics';
import ProjectTasks from '../pages/dashboard/ProjectTasks';
import ProjectMembers from '../pages/dashboard/ProjectMembers';
import ProjectDetails from '../pages/dashboard/ProjectDetails';
import RecoveryHandler from '../components/auth/RecoveryHandler';
import { ROUTES } from '../constants/routes';

function AppRouter() {
  return (
    <Router>
      <RecoveryHandler />
      <Routes>
        <Route
          path={ROUTES.ROOT}
          element={<Navigate to={ROUTES.LOGIN} replace />}
        />

        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<Login />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path={ROUTES.PROJECTS} element={<Projects />} />
            <Route path={ROUTES.PROJECT_EPICS} element={<ProjectEpics />} />
            <Route path={ROUTES.PROJECT_TASKS} element={<ProjectTasks />} />
            <Route path={ROUTES.PROJECT_MEMBERS} element={<ProjectMembers />} />
            <Route path={ROUTES.PROJECT_DETAILS} element={<ProjectDetails />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
