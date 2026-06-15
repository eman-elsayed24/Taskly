import type { Epic } from '../types/epic';
import { apiFetch } from '../lib/apiFetch';

export async function getProjectEpics(projectId: string): Promise<Epic[]> {
  const response = await apiFetch(
    `/rest/v1/project_epics?project_id=eq.${projectId}`,
    {
      method: 'GET',
      includeAuth: true,
    }
  );
  return response as Epic[];
}
