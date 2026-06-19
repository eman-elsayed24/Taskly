import { formatDate } from '../../../utils/formatDate';
import { getInitials } from '../../../utils/stringHelpers';
import type { EpicTask } from '../../../api/taskApi';
import CheckCircleIcon from '../../../assets/icons/checkCircle.svg?react';
import UnassignedIcon from '../../../assets/icons/unassigned.svg?react';

interface EpicTaskItemProps {
  task: EpicTask;
  isLast: boolean;
}

export default function EpicTaskItem({ task, isLast }: EpicTaskItemProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white hover:bg-surface-low transition-colors ${
        !isLast ? 'border-b border-slate-light/30' : ''
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="shrink-0">
          <CheckCircleIcon className="w-5 h-5 text-success-dark" />
        </div>

        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <h5 className="text-body-md text-slate-dark font-medium">
            {task.title}
          </h5>

          {task.assignee && task.assignee.name ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                {getInitials(task.assignee.name)}
              </div>
              <span className="text-body-sm text-slate-medium">
                {task.assignee.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-slate-light/20 flex items-center justify-center">
                <UnassignedIcon className="w-4 h-4" />
              </div>
              <span className="text-body-sm text-slate-light">Unassigned</span>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0">
        <div className="flex flex-col items-end gap-1 px-3 py-2">
          <span className="text-xs uppercase text-slate-light">
            DUE DATE
          </span>
          <span className="text-body-sm text-slate-medium font-medium">
            {task.due_date ? formatDate(task.due_date) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
