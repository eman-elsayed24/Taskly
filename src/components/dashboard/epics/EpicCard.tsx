import type { Epic } from '../../../types/epic';
import { formatDate } from '../../../utils/formatDate';
import UserAvatar from '../../ui/UserAvatar';
import PersonIcon from '../../../assets/icons/person.svg?react';
import EventIcon from '../../../assets/icons/event.svg?react';

interface EpicCardProps {
  epic: Epic;
  onClick?: () => void;
}

export default function EpicCard({ epic, onClick }: EpicCardProps) {
  return (
    <div
      className="bg-white rounded-md p-6 border-l-4 border-success-dark hover:shadow-sm transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Epic ID Badge */}
      <div className="inline-block bg-success/20 text-success-dark px-3 py-1 rounded text-label-sm mb-4">
        {epic.epic_id}
      </div>

      {/* Epic Title */}
      <h3 className="text-title-md text-slate-dark mb-6">{epic.title}</h3>

      {/* Assignee Section */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={epic.assignee?.name} size="lg" variant="success" />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 pt-4 border-t border-slate-light/20">
        <div className="flex items-center gap-2 text-body-sm text-slate-medium">
          <PersonIcon className="w-4 h-4 hidden sm:block" />
          <span className="sm:hidden text-slate-light">Created by: </span>
          <span className="hidden sm:inline">Created by: </span>
          <span>{epic.created_by.name}</span>
        </div>
        <div className="flex items-center gap-2 text-body-sm text-slate-medium">
          <EventIcon className="w-4 h-4 hidden sm:block" />
          <span>{formatDate(epic.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
