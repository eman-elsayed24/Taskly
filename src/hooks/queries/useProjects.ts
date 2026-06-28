import { useQuery } from '@tanstack/react-query';
import { getProjects, getProjectById } from '../../api/projectApi';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (limit: number, offset: number) =>
    [...projectKeys.lists(), { limit, offset }] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

export function useProjects(limit: number, offset: number) {
  return useQuery({
    queryKey: projectKeys.list(limit, offset),
    queryFn: () => getProjects(limit, offset),
  });
}

export function useProjectDetails(projectId: string) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  });
}
