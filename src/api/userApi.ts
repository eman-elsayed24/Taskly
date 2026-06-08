import type { User } from '../types/auth';
import { apiFetch } from '../lib/apiFetch';

type SupabaseUser = {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
    jobTitle?: string;
  };
};

export async function getCurrentUser(): Promise<User> {
  const data = await apiFetch<SupabaseUser>('/auth/v1/user', {
    method: 'GET',
    includeAuth: true,
  });

  return {
    id: data.id,
    email: data.email,
    name: data.user_metadata?.name,
    jobTitle: data.user_metadata?.jobTitle,
  };
}
