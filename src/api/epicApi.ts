import type { Epic } from '../types/epic';
import { apiFetch } from '../lib/apiFetch';

export interface GetProjectEpicsResponse {
  data: Epic[];
  totalCount: number;
}

export async function getProjectEpics(
  projectId: string,
  limit: number = 10,
  offset: number = 0,
  searchTerm?: string
): Promise<GetProjectEpicsResponse> {
  let url = `/rest/v1/project_epics?project_id=eq.${projectId}&limit=${limit}&offset=${offset}`;

  // Add search filter if search term exists
  if (searchTerm && searchTerm.trim()) {
    url += `&title=ilike.%25${encodeURIComponent(searchTerm.trim())}%25`;
  }

  const response = await apiFetch<GetProjectEpicsResponse>(url, {
    method: 'GET',
    includeAuth: true,
    headers: {
      Prefer: 'count=exact',
    },
    returnHeaders: true,
  });

  return response;
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

export async function getEpicById(
  projectId: string,
  epicId: string
): Promise<Epic> {
  const url = `/rest/v1/project_epics?project_id=eq.${projectId}&id=eq.${epicId}`;

  const response = await apiFetch<Epic[]>(url, {
    method: 'GET',
    includeAuth: true,
  });

  if (!response || response.length === 0) {
    throw new Error('Epic not found');
  }

  return response[0];
}

export interface UpdateEpicRequest {
  title?: string;
  description?: string | null;
  assignee_id?: string | null;
  deadline?: string | null;
}

export async function updateEpic(
  epicId: string,
  data: UpdateEpicRequest
): Promise<void> {
  await apiFetch(`/rest/v1/epics?id=eq.${epicId}`, {
    method: 'PATCH',
    body: data,
    includeAuth: true,
  });
}
