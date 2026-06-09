import type { CreateProjectRequest } from '../types/project';
import { apiFetch } from '../lib/apiFetch';

export async function createProject(data: CreateProjectRequest): Promise<void> {
  await apiFetch('/rest/v1/projects', {
    method: 'POST',
    body: {
      name: data.name,
      description: data.description || null,
    },
    includeAuth: true,
  });
}
