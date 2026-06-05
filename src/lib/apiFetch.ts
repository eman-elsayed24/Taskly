import { getHeaders, getApiUrl } from './api';
import { getRefreshToken, storeTokens, clearTokens } from './cookies';
import { refreshAccessToken } from '../api/authApi';

type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  includeAuth?: boolean;
};

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions
): Promise<T> {
  const makeRequest = async (
    includeAuth: boolean = options.includeAuth || false
  ) => {
    return fetch(getApiUrl(endpoint), {
      method: options.method,
      headers: getHeaders(includeAuth),
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  };

  let response = await makeRequest(options.includeAuth);

  // If 401 or 403 (Unauthorized/Forbidden), try to refresh token
  if (
    (response.status === 401 || response.status === 403) &&
    options.includeAuth
  ) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      throw new Error('SESSION_EXPIRED');
    }

    try {
      // Refresh the token
      const newTokens = await refreshAccessToken(refreshToken);

      storeTokens({
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
      });

      // Retry the original request with new token
      response = await makeRequest(true);
    } catch (err) {
      clearTokens();
      throw new Error('SESSION_EXPIRED', { cause: err });
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message || data?.error_description || 'Request failed'
    );
  }

  return data;
}
