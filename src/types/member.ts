export type MemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface ProjectMember {
  member_id: string;
  user_id: string;
  project_id: string;
  role: MemberRole;
  email: string;
  metadata: {
    sub: string;
    name: string;
    email: string;
    jobTitle?: string;
    email_verified: boolean;
    phone_verified: boolean;
  };
}

export interface InviteMemberRequest {
  p_email: string;
  p_project_id: string;
  p_app_url: string;
  p_base_url: string;
}

export interface InviteMemberResponse {
  success?: boolean;
  message?: string;
}


export interface AcceptInvitationRequest {
  p_token: string;
}

export interface AcceptInvitationResponse {
  success?: boolean;
  message?: string;
  project_id?: string;
  project_name?: string;
}

// get name from member
export function getMemberName(member: ProjectMember): string {
  return member.metadata?.name || 'Unknown User';
}

// get email from member
export function getMemberEmail(member: ProjectMember): string {
  return member.email || member.metadata?.email || 'No email';
}
