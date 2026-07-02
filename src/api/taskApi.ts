import type { CreateTaskPayload, TaskDetails } from '../types/task';
import { apiFetch } from '../lib/apiFetch';

// Shared response type for paginated task lists
interface PaginatedTasksResponse<T> {
  data: T[];
  totalCount: number;
}

// Minimal task info for epic tasks list
export type EpicTask = Pick<
  TaskDetails,
  'id' | 'title' | 'assignee' | 'due_date' | 'status'
>;

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

export interface EpicOption {
  id: string;
  epic_id: string;
  title: string;
}

export async function getEpicsByProject(
  projectId: string
): Promise<EpicOption[]> {
  const url = `/rest/v1/epics?project_id=eq.${projectId}&select=id,epic_id,title`;

  const response = await apiFetch<EpicOption[]>(url, {
    method: 'GET',
    includeAuth: true,
  });

  return response;
}

export async function getEpicTasks(epicId: string): Promise<EpicTask[]> {
  const url = `/rest/v1/project_tasks?epic_id=eq.${epicId}`;

  const response = await apiFetch<EpicTask[]>(url, {
    method: 'GET',
    includeAuth: true,
  });

  return response;
}

export async function getTasksByStatus(
  projectId: string,
  status: string,
  limit?: number,
  offset?: number,
  searchTerm?: string
): Promise<PaginatedTasksResponse<EpicTask>> {
  let url = `/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`;

  if (searchTerm && searchTerm.trim()) {
    url += `&title=ilike.%25${encodeURIComponent(searchTerm.trim())}%25`;
  }

  if (limit !== undefined && offset !== undefined) {
    url += `&limit=${limit}&offset=${offset}`;
  }

  const response = await apiFetch<PaginatedTasksResponse<EpicTask>>(url, {
    method: 'GET',
    includeAuth: true,
    headers: {
      Prefer: 'count=exact',
    },
    returnHeaders: true,
  });

  return response;
}

// Task with task_id for list views
export type TaskListItem = EpicTask & { task_id: string };

export async function getAllProjectTasks(
  projectId: string,
  limit?: number,
  offset?: number,
  searchTerm?: string
): Promise<PaginatedTasksResponse<TaskListItem>> {
  let url = `/rest/v1/project_tasks?project_id=eq.${projectId}`;

  if (searchTerm && searchTerm.trim()) {
    url += `&title=ilike.%25${encodeURIComponent(searchTerm.trim())}%25`;
  }

  if (limit !== undefined && offset !== undefined) {
    url += `&limit=${limit}&offset=${offset}`;
  }

  const response = await apiFetch<PaginatedTasksResponse<TaskListItem>>(url, {
    method: 'GET',
    includeAuth: true,
    headers: {
      Prefer: 'count=exact',
    },
    returnHeaders: true,
  });

  return response;
}

export async function getTaskById(
  projectId: string,
  taskId: string
): Promise<TaskDetails> {
  const url = `/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}`;

  const response = await apiFetch<TaskDetails[]>(url, {
    method: 'GET',
    includeAuth: true,
  });

  if (!response || response.length === 0) {
    throw new Error('Task not found');
  }

  return response[0];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string | null;
  assignee_id?: string | null;
  due_date?: string | null;
  epic_id?: string | null;
  status?: string;
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskRequest
): Promise<void> {
  await apiFetch(`/rest/v1/tasks?id=eq.${taskId}`, {
    method: 'PATCH',
    body: data,
    includeAuth: true,
  });
}
