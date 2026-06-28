import type { ProjectMember } from '../types/member';
import { apiFetch } from '../lib/apiFetch';

export async function getProjectMembers(
  projectId: string
): Promise<ProjectMember[]> {
  const response = await apiFetch(
    `/rest/v1/get_project_members?project_id=eq.${projectId}`,
    {
      method: 'GET',
      includeAuth: true,
    }
  );

  return response as ProjectMember[];
}
