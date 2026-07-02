import { getHeaders, getApiUrl } from './api';
import { getRefreshToken, storeTokens, clearTokens } from './cookies';
import { refreshAccessToken } from '../api/authApi';

type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  includeAuth?: boolean;
  headers?: Record<string, string>;
  returnHeaders?: boolean;
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
      const baseHeaders = getHeaders(includeAuth);
      const mergedHeaders = options.headers
        ? { ...baseHeaders, ...options.headers }
        : baseHeaders;

      return await fetch(getApiUrl(endpoint), {
        method: options.method,
        headers: mergedHeaders,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
    } catch {
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

    if (response.status === 403) {
      throw new Error(
        data?.msg ||
          data?.message ||
          'You do not have permission to perform this action'
      );
    }

    if (response.status === 401) {
      throw new Error(
        data?.msg || data?.message || 'Session expired, please login again'
      );
    }

    if (response.status === 400) {
      throw new Error(data?.msg || data?.message || 'Invalid request data');
    }

    if (response.status === 404) {
      throw new Error(data?.msg || data?.message || 'Resource not found');
    }

    if (response.status === 409) {
      throw new Error(
        data?.msg || data?.message || 'This resource already exists'
      );
    }

    if (response.status >= 500) {
      throw new Error(
        data?.msg || data?.message || 'Server error. Please try again later'
      );
    }

    // Generic fallback for other status codes
    throw new Error(data?.msg || data?.message || 'Request failed');
  }

  // If returnHeaders is true, return both data and headers
  if (options.returnHeaders) {
    const contentRange = response.headers.get('Content-Range');
    let totalCount = 0;

    if (contentRange) {
      const match = contentRange.match(/\/(\d+)$/);
      if (match) {
        totalCount = parseInt(match[1], 10);
      }
    }

    return {
      data,
      totalCount,
    } as T;
  }

  return data;
}
