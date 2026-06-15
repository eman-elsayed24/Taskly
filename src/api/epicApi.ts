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

export interface CreateEpicRequest {
  title: string;
  description?: string;
  assignee_id?: string;
  project_id: string;
  deadline?: string;
}

export async function createEpic(data: CreateEpicRequest): Promise<void> {
  await apiFetch('/rest/v1/epics', {
    method: 'POST',
    body: {
      title: data.title,
      description: data.description || null,
      assignee_id: data.assignee_id || null,
      project_id: data.project_id,
      deadline: data.deadline || null,
    },
    includeAuth: true,
  });
}
