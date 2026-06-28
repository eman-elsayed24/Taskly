import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../../api/projectApi';

export const projectKeys = {
  all: ['projects'] as const,
  lists: () => [...projectKeys.all, 'list'] as const,
  list: (limit: number, offset: number) =>
    [...projectKeys.lists(), { limit, offset }] as const,
};

export function useProjects(limit: number, offset: number) {
  return useQuery({
    queryKey: projectKeys.list(limit, offset),
    queryFn: () => getProjects(limit, offset),
  });
}
