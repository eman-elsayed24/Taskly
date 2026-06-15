import type { Epic } from '../../../types/epic';
import { getInitials, getAvatarColor } from '../../../lib/utils/avatar';
import PersonIcon from '../../../assets/icons/groups.svg?react';
import EventIcon from '../../../assets/icons/event.svg?react';

interface EpicCardProps {
  epic: Epic;
}

export default function EpicCard({ epic }: EpicCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const assigneeInitials = epic.assignee
    ? getInitials(epic.assignee.name)
    : '?';
  const assigneeColor = epic.assignee
    ? getAvatarColor(epic.assignee.name)
    : 'bg-slate-light/20 text-slate-medium';

  return (
    <div className="bg-white rounded-md p-6 border-l-4 border-success hover:shadow-sm transition-shadow">
      {/* Epic ID Badge */}
      <div className="inline-block bg-success/20 text-success-dark px-3 py-1 rounded text-label-sm mb-4">
        {epic.epic_id}
      </div>

      {/* Epic Title */}
      <h3 className="text-title-md text-slate-dark mb-6">{epic.title}</h3>

      {/* Assignee Section */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${assigneeColor}`}
          >
            {assigneeInitials}
          </div>
          <div>
            <p className="text-body-sm text-slate-light uppercase tracking-wide">
              Assignee
            </p>
            <p className="text-body-md font-semibold text-slate-dark">
              {epic.assignee?.name || 'Unassigned'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer: Created By and Date */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-light/20">
        <div className="flex items-center gap-2 text-body-sm text-slate-medium">
          <PersonIcon className="w-4 h-4" />
          <span>Created by: {epic.created_by.name}</span>
        </div>
        <div className="flex items-center gap-2 text-body-sm text-slate-medium">
          <EventIcon className="w-4 h-4" />
          <span>{formatDate(epic.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
