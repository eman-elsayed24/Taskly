import { formatDate } from '../../../utils/formatDate';
import UserAvatar from '../../ui/UserAvatar';
import type { EpicTask } from '../../../api/taskApi';
import CheckCircleIcon from '../../../assets/icons/checkCircle.svg?react';

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

          <UserAvatar
            name={task.assignee?.name}
            size="xs"
            variant="primary"
            showName
            containerClassName="items-center"
          />
        </div>
      </div>

      <div className="shrink-0">
        <div className="flex flex-col items-end gap-1 px-3 py-2">
          <span className="text-xs uppercase text-slate-light">DUE DATE</span>
          <span className="text-body-sm text-slate-medium font-medium">
            {task.due_date ? formatDate(task.due_date) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
}
