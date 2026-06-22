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

export interface EpicTask {
  id: string;
  title: string;
  assignee: {
    sub: string;
    name: string;
    email: string;
  } | null;
  due_date: string | null;
  status: string;
}

export async function getEpicTasks(epicId: string): Promise<EpicTask[]> {
  const url = `/rest/v1/project_tasks?epic_id=eq.${epicId}`;

  const response = await apiFetch<EpicTask[]>(url, {
    method: 'GET',
    includeAuth: true,
  });

  return response;
}

export interface TaskByStatus {
  id: string;
  title: string;
  due_date: string | null;
  assignee: {
    sub: string;
    name: string;
    email: string;
  } | null;
}

export async function getTasksByStatus(
  projectId: string,
  status: string
): Promise<TaskByStatus[]> {
  const url = `/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`;

  const response = await apiFetch<TaskByStatus[]>(url, {
    method: 'GET',
    includeAuth: true,
  });

  return response;
}

export interface ProjectTask {
  id: string;
  title: string;
  status: string;
  due_date: string | null;
  assignee: {
    sub: string;
    name: string;
    email: string;
  } | null;
}

export async function getAllProjectTasks(
  projectId: string
): Promise<ProjectTask[]> {
  const url = `/rest/v1/project_tasks?project_id=eq.${projectId}`;

  const response = await apiFetch<ProjectTask[]>(url, {
    method: 'GET',
    includeAuth: true,
  });

  return response;
}
