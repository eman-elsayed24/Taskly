import type { LoginRequest, SignupRequest, AuthResponse } from '../types/auth';
import { getHeaders, getApiUrl } from '../lib/api';

export async function loginUser(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const response = await fetch(
    getApiUrl('/auth/v1/token?grant_type=password'),
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.msg || error.error_description || 'Invalid email or password'
    );
  }

  return response.json();
}

export async function signupUser(
  userData: SignupRequest
): Promise<AuthResponse> {
  const response = await fetch(getApiUrl('/auth/v1/signup'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      email: userData.email,
      password: userData.password,
      data: {
        name: userData.name,
        jobTitle: userData.jobTitle,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.msg || error.error_description || 'Signup failed');
  }

  return response.json();
}

export async function refreshAccessToken(
  refreshToken: string
): Promise<AuthResponse> {
  const response = await fetch(
    getApiUrl('/auth/v1/token?grant_type=refresh_token'),
    {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  return response.json();
}

export async function logoutUser(): Promise<void> {
  const response = await fetch(getApiUrl('/auth/v1/logout'), {
    method: 'POST',
    headers: getHeaders(true),
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
}

export async function resetPassword(email: string): Promise<void> {
  const response = await fetch(getApiUrl('/auth/v1/recover'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.msg || error.error_description || 'Failed to send reset link'
    );
  }
}

export async function updatePassword(
  accessToken: string,
  newPassword: string
): Promise<void> {
  const response = await fetch(getApiUrl('/auth/v1/user'), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.msg || error.error_description || 'Failed to update password'
    );
  }
}
