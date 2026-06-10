import { getHeaders, getApiUrl } from './api';
import { getRefreshToken, storeTokens, clearTokens } from './cookies';
import { refreshAccessToken } from '../api/authApi';

type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  includeAuth?: boolean;
};

let isRefreshing = false;

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions
): Promise<T> {
  const makeRequest = async (
    includeAuth: boolean = options.includeAuth || false
  ) => {
    try {
      return await fetch(getApiUrl(endpoint), {
        method: options.method,
        headers: getHeaders(includeAuth),
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch (error) {
      // Network error 
      throw new Error('Network error. Please check your connection.');
    }
  };

  let response = await makeRequest(options.includeAuth);

  // If 401 or 403 (Unauthorized/Forbidden), try to refresh token ONCE
  if (
    (response.status === 401 || response.status === 403) &&
    options.includeAuth &&
    !isRefreshing
  ) {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      throw new Error('SESSION_EXPIRED');
    }

    try {
      isRefreshing = true;
      const newTokens = await refreshAccessToken(refreshToken);

      storeTokens({
        access_token: newTokens.access_token,
        refresh_token: newTokens.refresh_token,
      });

      // Retry the original request with new token
      response = await makeRequest(true);
    } catch (err) {
      clearTokens();
      isRefreshing = false;
      throw new Error('SESSION_EXPIRED', { cause: err });
    } finally {
      isRefreshing = false;
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.msg || data?.message || 'Request failed');
  }

  return data;
}
