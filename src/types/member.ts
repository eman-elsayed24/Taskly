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

// Helper to get name from member
export function getMemberName(member: ProjectMember): string {
  return member.metadata?.name || 'Unknown User';
}

// Helper to get email from member
export function getMemberEmail(member: ProjectMember): string {
  return member.email || member.metadata?.email || 'No email';
}
