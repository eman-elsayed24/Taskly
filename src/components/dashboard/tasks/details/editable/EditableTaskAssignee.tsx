import { useState } from 'react';
import type { ProjectMember } from '../../../../../types/member';
import type { TaskAssignee } from '../../../../../types/task';
import UserAvatar from '../../../../ui/UserAvatar';

interface EditableTaskAssigneeProps {
  assignee: TaskAssignee | null;
  projectMembers: ProjectMember[];
  isError?: boolean;
  isSaving: boolean;
  onUpdate: (userId: string | null) => void;
}

export default function EditableTaskAssignee({
  assignee,
  projectMembers,
  isError,
  isSaving,
  onUpdate,
}: EditableTaskAssigneeProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (userId: string | null) => {
    setIsEditing(false);
    const currentAssigneeId = assignee
      ? projectMembers.find(m => m.metadata.name === assignee.name)?.user_id
      : null;

    if (userId !== currentAssigneeId) {
      onUpdate(userId);
    }
  };

  const hasMembersLoaded = projectMembers.length > 0;

  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
        Assignee
      </p>
      {isEditing ? (
        <div className="space-y-2">
          {!hasMembersLoaded && !isError ? (
            <div className="rounded-xl bg-white p-3 text-sm text-slate-medium">
              Loading members...
            </div>
          ) : isError ? (
            <div className="rounded-xl bg-error-background p-4 border border-error/20">
              <p className="text-sm text-error mb-2">Failed to load members</p>
              <button
                onClick={() => setIsEditing(false)}
                className="text-xs text-primary hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <select
              value={
                projectMembers.find(m => m.metadata.name === assignee?.name)
                  ?.user_id || ''
              }
              onChange={e => handleChange(e.target.value || null)}
              className="w-full px-3 py-2 border border-primary rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              autoFocus
              onBlur={() => setIsEditing(false)}
              disabled={isSaving}
            >
              <option value="">Unassigned</option>
              {projectMembers.map(member => (
                <option key={member.user_id} value={member.user_id}>
                  {member.metadata.name}
                </option>
              ))}
            </select>
          )}
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="rounded-xl bg-white p-3 cursor-pointer hover:bg-surface-low transition-colors"
        >
          <UserAvatar
            name={assignee?.name}
            jobTitle={assignee?.department}
            size="md"
            showName={true}
          />
        </div>
      )}
    </div>
  );
}
