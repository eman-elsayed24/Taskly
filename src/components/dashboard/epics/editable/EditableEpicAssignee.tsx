import { useState } from 'react';
import type { EpicUser } from '../../../../types/epic';
import type { ProjectMember } from '../../../../types/member';
import { getInitials } from '../../../../utils/stringHelpers';
import UnassignedIcon from '../../../../assets/icons/unassigned.svg?react';

interface EditableEpicAssigneeProps {
  assignee: EpicUser | null;
  projectMembers: ProjectMember[];
  isSaving: boolean;
  onUpdate: (userId: string | null) => void;
}

export default function EditableEpicAssignee({
  assignee,
  projectMembers,
  isSaving,
  onUpdate,
}: EditableEpicAssigneeProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (userId: string | null) => {
    setIsEditing(false);
    if (userId !== (assignee?.sub || null)) {
      onUpdate(userId);
    }
  };

  const assigneeInitials = assignee ? getInitials(assignee.name) : null;

  return (
    <div className="space-y-3">
      <p className="text-label-sm text-slate-light uppercase">Assignee</p>
      {isEditing ? (
        <select
          value={assignee?.sub || ''}
          onChange={e => handleChange(e.target.value || null)}
          className="w-full px-3 py-2 border border-primary rounded focus:outline-none focus:ring-2 focus:ring-primary/20 text-body-md"
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
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-3 cursor-pointer hover:bg-surface-low rounded px-3 py-2 -mx-3"
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm ${
              assignee
                ? 'bg-success/20 text-success-dark'
                : 'bg-slate-light/20 text-slate-muted'
            }`}
          >
            {assignee && assignee.name ? (
              assigneeInitials
            ) : (
              <UnassignedIcon className="w-4 h-4" />
            )}
          </div>
          <div>
            <h5
              className={`text-body-md ${
                assignee ? 'text-slate-dark' : 'text-slate-muted font-medium'
              }`}
            >
              {assignee?.name || 'Unassigned'}
            </h5>
          </div>
        </div>
      )}
    </div>
  );
}
