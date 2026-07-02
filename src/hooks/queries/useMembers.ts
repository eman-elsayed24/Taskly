import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProjectMembers,
  inviteMember,
  acceptInvitation,
} from '../../api/memberApi';
import type {
  InviteMemberRequest,
  AcceptInvitationRequest,
} from '../../types/member';

export const memberKeys = {
  all: ['members'] as const,
  lists: () => [...memberKeys.all, 'list'] as const,
  list: (projectId: string) => [...memberKeys.lists(), projectId] as const,
};

export function useProjectMembers(projectId: string) {
  return useQuery({
    queryKey: memberKeys.list(projectId),
    queryFn: () => getProjectMembers(projectId),
    enabled: !!projectId,
  });
}

export function useInviteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteMemberRequest) => inviteMember(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.list(variables.p_project_id),
      });
    },
  });
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (data: AcceptInvitationRequest) => acceptInvitation(data),
  });
}
