import { useQuery } from '@tanstack/react-query';
import { getProjectEpics, getEpicById } from '../../api/epicApi';

// Query Keys Factory
export const epicKeys = {
  all: ['epics'] as const,
  lists: () => [...epicKeys.all, 'list'] as const,
  list: (projectId: string, limit: number, offset: number, search?: string) =>
    [...epicKeys.lists(), { projectId, limit, offset, search }] as const,
  details: () => [...epicKeys.all, 'detail'] as const,
  detail: (projectId: string, epicId: string) =>
    [...epicKeys.details(), { projectId, epicId }] as const,
};

//  Get project epics with pagination and search
export function useProjectEpics(
  projectId: string,
  limit: number,
  offset: number,
  searchTerm?: string
) {
  return useQuery({
    queryKey: epicKeys.list(projectId, limit, offset, searchTerm),
    queryFn: () => getProjectEpics(projectId, limit, offset, searchTerm),
    enabled: !!projectId,
  });
}

//  epic details
export function useEpicDetails(projectId: string, epicId: string) {
  return useQuery({
    queryKey: epicKeys.detail(projectId, epicId),
    queryFn: () => getEpicById(projectId, epicId),
    enabled: !!projectId && !!epicId,
  });
}
