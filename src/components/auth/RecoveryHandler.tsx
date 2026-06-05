import { useEffect } from 'react';

export default function RecoveryHandler() {
  useEffect(() => {
    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const type = hashParams.get('type');
      const accessToken = hashParams.get('access_token');

      if (type === 'recovery' && accessToken) {
        // Clear the hash from the browser address bar
        window.history.replaceState(null, '', window.location.pathname);
        // redirect to the reset-password page with query parameter
        window.location.href = `/reset-password?access_token=${accessToken}`;
      }
    }
  }, []);

  return null;
}
