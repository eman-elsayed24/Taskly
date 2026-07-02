import type {
  ProjectMember,
  InviteMemberRequest,
  InviteMemberResponse,
  AcceptInvitationRequest,
  AcceptInvitationResponse,
} from '../types/member';
import { apiFetch } from '../lib/apiFetch';

export async function getProjectMembers(
  projectId: string
): Promise<ProjectMember[]> {
  const response = await apiFetch(
    `/rest/v1/get_project_members?project_id=eq.${projectId}`,
    {
      method: 'GET',
      includeAuth: true,
    }
  );

  return response as ProjectMember[];
}

export async function inviteMember(
  data: InviteMemberRequest
): Promise<InviteMemberResponse> {
  const response = await apiFetch('/rest/v1/rpc/invite_member', {
    method: 'POST',
    includeAuth: true,
    body: data,
  });

  return response as InviteMemberResponse;
}

export async function acceptInvitation(
  data: AcceptInvitationRequest
): Promise<AcceptInvitationResponse> {
  const response = await apiFetch('/rest/v1/rpc/accept_invitation', {
    method: 'POST',
    includeAuth: true,
    body: data,
  });

  return response as AcceptInvitationResponse;
}
