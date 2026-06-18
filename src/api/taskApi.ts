import type { CreateTaskPayload } from '../types/task';
import { apiFetch } from '../lib/apiFetch';

export async function createTask(data: CreateTaskPayload): Promise<void> {
  await apiFetch('/rest/v1/tasks', {
    method: 'POST',
    body: {
      project_id: data.project_id,
      epic_id: data.epic_id || null,
      title: data.title,
      description: data.description || null,
      assignee_id: data.assignee_id || null,
      due_date: data.due_date || null,
      status: data.status || 'TO_DO',
    },
    includeAuth: true,
  });
}

export async function getEpicsByProject(projectId: string): Promise<any[]> {
  const url = `/rest/v1/epics?project_id=eq.${projectId}&select=id,epic_id,title`;

  const response = await apiFetch<any[]>(url, {
    method: 'GET',
    includeAuth: true,
  });

  return response;
}
