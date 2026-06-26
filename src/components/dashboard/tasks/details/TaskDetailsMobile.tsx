import Badge from '../../../ui/badge';
import UserAvatar from '../../../ui/UserAvatar';
import { formatDate } from '../../../../utils/formatDate';
import {
  TaskStatus,
  TASK_STATUS_LABELS,
  type TaskDetails,
} from '../../../../types/task';
import { getStatusBadgeStyle } from '../../../../constants/taskStyles';
import EpicIdIcon from '../../../../assets/icons/epicId.svg?react';

interface TaskDetailsMobileProps {
  task: TaskDetails;
  onClose: () => void;
}

export default function TaskDetailsMobile({
  task,
  onClose,
}: TaskDetailsMobileProps) {
  return (
    <>
      {/* Handle Bar */}
      <div className="flex justify-center pt-3">
        <div className="h-1 w-12 rounded-full bg-slate-light" />
      </div>

      <div className="p-6">
   
        <div className="mb-3 flex items-start justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-medium">
            {task.task_id}
          </span>
          <button
            onClick={onClose}
            className="text-2xl text-slate-medium hover:text-slate-dark"
          >
            ×
          </button>
        </div>

  
        <h1 className="mb-5 text-2xl font-semibold leading-tight text-slate-dark">
          {task.title}
        </h1>

        {/* Status + Epic */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge
            className={`px-3 py-1 text-xs font-bold rounded-xl ${getStatusBadgeStyle(task.status)}`}
          >
            {TASK_STATUS_LABELS[task.status as TaskStatus] || task.status}
          </Badge>
          {task.epic?.epic_id && (
            <span className="flex items-center gap-1 rounded-full bg-surface-highest px-3 py-1 text-xs font-bold text-slate-dark">
              <EpicIdIcon className="w-3 h-3" />
              {task.epic.epic_id}
            </span>
          )}
        </div>

       
        <div className="mb-6 grid grid-cols-2 gap-3">
        
          <div className="rounded-xl bg-white p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
              Assignee
            </p>
            <UserAvatar
              name={task.assignee?.name}
              jobTitle={task.assignee?.department}
              size="sm"
              showName={true}
            />
          </div>

  
          <div className="rounded-xl bg-white p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
              Due Date
            </p>
            <p className="text-sm font-medium text-slate-dark">
              {task.due_date ? formatDate(task.due_date) : '—'}
            </p>
          </div>

        
          <div className="rounded-xl bg-white p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
              Reporter
            </p>
            {task.created_by ? (
              <div className="flex items-center gap-2">
                <UserAvatar name={task.created_by.name} size="sm" />
                <span className="text-sm font-medium text-slate-dark truncate">
                  {task.created_by.name}
                </span>
              </div>
            ) : (
              <span className="text-sm text-slate-medium font-normal">
                Unknown
              </span>
            )}
          </div>

     
          <div className="rounded-xl bg-white p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
              Created At
            </p>
            <p className="text-sm font-medium text-slate-dark">
              {formatDate(task.created_at)}
            </p>
          </div>
        </div>

      
        <div className="pb-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
            Description
          </p>
          <div className="rounded-xl bg-white p-4">
            {task.description ? (
              <p className="text-sm leading-relaxed text-slate-dark whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="text-sm text-slate-medium italic">
                No description provided
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
