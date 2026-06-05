import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { RootState } from '../redux/store';
import { fetchCurrentUserThunk } from '../redux/slices/userSlice';
import { isAuthenticated } from '../lib/cookies';
import Spinner from '../components/ui/spinner';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const { data: user, isLoading } = useAppSelector(
    (state: RootState) => state.user
  );
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!isAuthenticated()) {
        setIsInitializing(false);
        return;
      }

      if (user) {
        setIsInitializing(false);
        return;
      }

      await dispatch(fetchCurrentUserThunk());
      setIsInitializing(false);
    };

    loadUser();
  }, [dispatch, user]);

  if (isInitializing || isLoading) {
    return <Spinner />;
  }

  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
