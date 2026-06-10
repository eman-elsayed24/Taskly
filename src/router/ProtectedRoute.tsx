import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { fetchCurrentUserThunk } from '../redux/slices/userSlice';
import { isAuthenticated } from '../lib/cookies';
import Spinner from '../components/ui/spinner';
import ErrorState from '../components/ui/ErrorState';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector(state => state.user);
  const [isInitializing, setIsInitializing] = useState(true);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const hasAttempted = useRef(false);

  const loadUser = async () => {
    // Reset states
    setHasNetworkError(false);
    hasAttempted.current = false;
    setIsInitializing(true);

    // Not authenticated - redirect to login
    if (!isAuthenticated()) {
      setIsInitializing(false);
      return;
    }

    // User already loaded
    if (user) {
      setIsInitializing(false);
      return;
    }

    // Mark as attempted
    hasAttempted.current = true;

    // Try to fetch user
    try {
      await dispatch(fetchCurrentUserThunk()).unwrap();
      setIsInitializing(false);
    } catch (err: any) {
      const errorMessage = err?.message || err?.toString() || '';

      // Check if it's a network error (not auth error)
      if (errorMessage.includes('Network error')) {
        // Network error - show error state
        setHasNetworkError(true);
        setIsInitializing(false);
      } else {
        
        setIsInitializing(false);
      }
    }
  };

  useEffect(() => {
    if (!hasAttempted.current) {
      loadUser();
    }
  }, []);

  // Still loading
  if (isInitializing) {
    return <Spinner />;
  }

  // Network error - show error state with retry
  if (hasNetworkError) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <ErrorState
          title="Connection Error"
          message="We're having trouble connecting to the server. Please check your internet connection and try again."
          onRetry={loadUser}
          retryButtonText="Retry Connection"
        />
      </div>
    );
  }

 
  if (!isAuthenticated() || !user) {
    return <Navigate to="/login" replace />;
  }

  // All good - show protected content
  return <Outlet />;
}

export default ProtectedRoute;
