import { useState } from 'react';
import type { EpicUser } from '../../../../types/epic';
import type { ProjectMember } from '../../../../types/member';
import UserAvatar from '../../../ui/UserAvatar';

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
          <UserAvatar name={assignee?.name} size="md" variant="success" />
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
