import type { CreateProjectRequest, Project } from '../types/project';
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

export async function getProjects(): Promise<Project[]> {
  const response = await apiFetch('/rest/v1/rpc/get_projects', {
    method: 'GET',
    includeAuth: true,
  });
  return response as Project[];
}
