import { useQuery } from '@tanstack/react-query';
import {
  getAllProjectTasks,
  getTasksByStatus,
  getTaskById,
} from '../../api/taskApi';

export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (projectId: string, limit: number, offset: number, search?: string) =>
    [...taskKeys.lists(), { projectId, limit, offset, search }] as const,
  byStatus: (
    projectId: string,
    status: string,
    limit?: number,
    offset?: number,
    search?: string
  ) =>
    [
      ...taskKeys.all,
      'byStatus',
      { projectId, status, limit, offset, search },
    ] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (projectId: string, taskId: string) =>
    [...taskKeys.details(), { projectId, taskId }] as const,
};

export function useProjectTasks(
  projectId: string,
  limit: number,
  offset: number,
  searchTerm?: string
) {
  return useQuery({
    queryKey: taskKeys.list(projectId, limit, offset, searchTerm),
    queryFn: () => getAllProjectTasks(projectId, limit, offset, searchTerm),
    enabled: !!projectId,
  });
}

export function useTasksByStatus(
  projectId: string,
  status: string,
  limit?: number,
  offset?: number,
  searchTerm?: string
) {
  return useQuery({
    queryKey: taskKeys.byStatus(projectId, status, limit, offset, searchTerm),
    queryFn: () =>
      getTasksByStatus(projectId, status, limit, offset, searchTerm),
    enabled: !!projectId && !!status,
  });
}

export function useTaskDetails(projectId: string, taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(projectId, taskId),
    queryFn: () => getTaskById(projectId, taskId),
    enabled: !!projectId && !!taskId,
  });
}
