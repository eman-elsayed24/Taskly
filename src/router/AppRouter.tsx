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
import AuthLayout from '../components/auth/AuthLayout';
import DashboardLayout from '../components/dashboard/layout/DashboardLayout';
import Projects from '../pages/dashboard/Projects';
import ProjectEpics from '../pages/dashboard/ProjectEpics';
import ProjectTasks from '../pages/dashboard/ProjectTasks';
import ProjectMembers from '../pages/dashboard/ProjectMembers';
import ProjectDetails from '../pages/dashboard/ProjectDetails';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Root redirects to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/dashboard"
              element={<Navigate to="/dashboard/projects" replace />}
            />
            <Route path="/dashboard/projects" element={<Projects />} />
            <Route path="/dashboard/project-epics" element={<ProjectEpics />} />
            <Route path="/dashboard/project-tasks" element={<ProjectTasks />} />
            <Route
              path="/dashboard/project-members"
              element={<ProjectMembers />}
            />
            <Route
              path="/dashboard/project-details"
              element={<ProjectDetails />}
            />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
