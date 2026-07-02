import { apiFetch } from '../lib/apiFetch';
import type {
  CalendarStatsRequest,
  CalendarStatsResponse,
  TasksPerProjectRequest,
  TasksPerProjectResponse,
} from '../types/statistics';

export async function getCalendarStats(
  params: CalendarStatsRequest
): Promise<CalendarStatsResponse> {
  const response = await apiFetch<CalendarStatsResponse>(
    '/rest/v1/rpc/get_tasks_calendar_stats',
    {
      method: 'POST',
      body: params,
      includeAuth: true,
    }
  );

  return response;
}

export async function getTasksPerProject(
  params: TasksPerProjectRequest
): Promise<TasksPerProjectResponse> {
  const response = await apiFetch<TasksPerProjectResponse>(
    '/rest/v1/rpc/get_tasks_count_per_project',
    {
      method: 'POST',
      body: params,
      includeAuth: true,
    }
  );

  return response;
}
