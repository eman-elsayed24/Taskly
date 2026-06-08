import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function RecoveryHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');

      if (type === 'recovery' && accessToken) {
        navigate(`${ROUTES.RESET_PASSWORD}?access_token=${accessToken}`, {
          replace: true,
        });
      }
    }
  }, [navigate]);

  return null;
}
