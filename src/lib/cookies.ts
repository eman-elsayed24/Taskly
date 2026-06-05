import type { AuthTokens } from '../types/auth';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function setCookie(name: string, value: string, days: number = 7): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
}

export function getCookie(name: string): string | null {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(nameEQ)) {
      return cookie.substring(nameEQ.length);
    }
  }
  return null;
}

export function removeCookie(name: string): void {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

export function storeTokens(
  tokens: AuthTokens,
  rememberMe: boolean = false
): void {
  // Access token expires in 1 hour (from Supabase expires_in: 3600)
  // Convert seconds to days: 3600 / (24 * 60 * 60) ≈ 0.042 days
  const accessTokenDays = tokens.expires_in
    ? tokens.expires_in / (24 * 60 * 60)
    : 0.042;

  // Refresh token can be stored longer based on remember me
  const refreshTokenDays = rememberMe ? 30 : 7;

  setCookie(ACCESS_TOKEN_KEY, tokens.access_token, accessTokenDays);
  setCookie(REFRESH_TOKEN_KEY, tokens.refresh_token, refreshTokenDays);
}

export function getAccessToken(): string | null {
  return getCookie(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return getCookie(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  removeCookie(ACCESS_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}
