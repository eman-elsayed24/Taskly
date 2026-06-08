import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RecoveryHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');

      if (type === 'recovery' && accessToken) {
        // Navigate to reset-password page
        navigate(`/reset-password?access_token=${accessToken}`, {
          replace: true,
        });
      }
    }
  }, [navigate]);

  return null;
}
