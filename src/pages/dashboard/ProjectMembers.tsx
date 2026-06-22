import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useProject } from '../../hooks/useProject';
import Button from '../../components/ui/button';
import Badge from '../../components/ui/badge';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ErrorState from '../../components/ui/ErrorState';
import MemberTableSkeleton from '../../components/dashboard/members/MemberTableSkeleton';
import { getProjectMembers } from '../../api/memberApi';
import type { ProjectMember } from '../../types/member';
import { getMemberName, getMemberEmail } from '../../types/member';
import { ROUTES } from '../../constants/routes';
import { getInitials } from '../../utils/stringHelpers';
import PersonAddIcon from '../../assets/icons/person-add.svg?react';
import MoreVerticalIcon from '../../assets/icons/more-vertical.svg?react';

const roleVariants: Record<string, 'primary' | 'secondary' | 'ghost'> = {
  owner: 'primary',
  admin: 'secondary',
  member: 'secondary',
  viewer: 'ghost',
};

function normalizeRole(role: string): string {
  return role.toUpperCase();
}

export default function ProjectMembers() {
  const { projectId } = useParams<{ projectId: string }>();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const { project } = useProject(projectId);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const membersData = await getProjectMembers(projectId);

        if (isMounted) {
          setMembers(membersData);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
          toast.error(
            error instanceof Error
              ? error.message
              : 'Failed to load project members'
          );
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const handleRetry = () => {
    if (!projectId) return;

    setIsLoading(true);
    setHasError(false);

    getProjectMembers(projectId)
      .then(membersData => {
        setMembers(membersData);
        setIsLoading(false);
      })
      .catch(error => {
        setHasError(true);
        setIsLoading(false);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to load project members'
        );
      });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="mb-8">
          <div className="h-6 w-64 bg-surface-highest rounded mb-4 animate-pulse" />
          <div className="flex items-center justify-between">
            <div className="h-10 w-48 bg-surface-highest rounded animate-pulse" />
            <div className="h-10 w-32 bg-surface-highest rounded animate-pulse hidden sm:block" />
          </div>
        </div>
        <MemberTableSkeleton />
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorState
          title="Failed to Load Members"
          message="Failed to load project members. Please try again."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'PROJECTS', href: ROUTES.PROJECTS },
            {
              label: project?.name || 'PROJECT',
              href: projectId ? ROUTES.PROJECT_DETAILS(projectId) : undefined,
            },
            { label: 'MEMBERS' },
          ]}
        />

        {/* Title and Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-heading-xl text-slate-dark">Project Members</h1>
          <Button
            variant="primary"
            className="hidden sm:flex items-center gap-2 w-full sm:w-auto"
          >
            <PersonAddIcon className="w-5 h-5" />
            Invite Member
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="  mx-auto w-3xl border border-slate-light/30">
          <thead className="bg-surface-low">
            <tr>
              <th className="py-4 px-6 text-left text-label-sm text-slate-light uppercase tracking-wide">
                MEMBER
              </th>
              <th className="py-4 px-6 text-left text-label-sm text-slate-light uppercase tracking-wide">
                ROLE
              </th>
              <th className="py-4 px-6 text-right text-label-sm text-slate-light uppercase tracking-wide">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {members.map((member, index) => {
              const memberName = getMemberName(member);
              const memberEmail = getMemberEmail(member);
              const initials = getInitials(memberName);

              return (
                <tr
                  key={`${member.user_id}-${index}`}
                  className="border-t border-slate-light/30"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-body-md font-semibold text-slate-dark truncate">
                          {memberName}
                        </p>
                        <p className="text-body-sm text-slate-medium truncate">
                          {memberEmail}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Badge variant={roleVariants[member.role] || 'ghost'}>
                      {normalizeRole(member.role)}
                    </Badge>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end">
                      {member.role !== 'owner' && (
                        <button
                          className="p-2 hover:bg-surface-low rounded transition-colors"
                          aria-label="Member actions"
                        >
                          <MoreVerticalIcon className="w-5 h-5 text-slate-medium" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {members.map(member => {
          const memberName = getMemberName(member);
          const memberEmail = getMemberEmail(member);
          const initials = getInitials(memberName);

          return (
            <div
              key={`${member.user_id}`}
              className="bg-white rounded-md p-4 flex items-center gap-3 overflow-hidden"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm shrink-0">
                  {initials}
                </div>
                <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                  <p className="text-body-md font-semibold text-slate-dark truncate">
                    {memberName}
                  </p>
                  <p className="text-body-sm text-slate-medium truncate">
                    {memberEmail}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Badge variant={roleVariants[member.role] || 'ghost'}>
                  {normalizeRole(member.role)}
                </Badge>
                {member.role !== 'owner' && (
                  <button
                    className="p-1 hover:bg-surface-low rounded transition-colors"
                    aria-label="Member actions"
                  >
                    <MoreVerticalIcon className="w-5 h-5 text-slate-medium" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Add Button - Mobile Only */}
      <button className="fixed sm:hidden bg-primary w-14 h-14 bottom-8 right-5 z-50 text-white rounded-md flex items-center justify-center shadow-lg">
        <PersonAddIcon className="w-6 h-6" />
      </button>
    </div>
  );
}
