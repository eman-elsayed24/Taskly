import { useQuery } from '@tanstack/react-query';
import { getProjectMembers } from '../../api/memberApi';


export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (projectId: string) => [...memberKeys.lists(), projectId] as const,
};

//  project members
export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: memberKeys.list(projectId),
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  });
}
