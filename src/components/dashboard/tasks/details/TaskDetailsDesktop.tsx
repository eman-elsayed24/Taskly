import UserAvatar from '../../../ui/UserAvatar';
import TaskStatusSelect from './TaskStatusSelect';
import { formatDate } from '../../../../utils/formatDate';
import { getStatusBadgeStyle } from '../../../../constants/taskStyles';
import type { TaskDetails } from '../../../../types/task';
import EpicIdIcon from '../../../../assets/icons/epicId.svg?react';
import CopyIcon from '../../../../assets/icons/copy.svg?react';

interface TaskDetailsDesktopProps {
  task: TaskDetails;
  onClose: () => void;
}

export default function TaskDetailsDesktop({
  task,
  onClose,
}: TaskDetailsDesktopProps) {
  return (
    <div className="h-full grid grid-cols-[1fr_320px]">
      <div className="flex flex-col">
        <div className="border-b border-slate-light/20 p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase">
              {task.task_id}
            </span>
            {task.epic?.epic_id && (
              <>
                <EpicIdIcon className="text-slate-medium" />
                <span className="text-sm font-medium text-slate-medium">
                  {task.epic.epic_id}
                </span>
              </>
            )}
          </div>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-slate-dark">
            {task.title}
          </h1>
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-medium">
            Description
          </h3>
          {task.description ? (
            <p className="max-w-3xl text-sm text-slate-dark leading-relaxed whitespace-pre-wrap">
              {task.description}
            </p>
          ) : (
            <p className="text-sm text-slate-medium italic">
              No description provided
            </p>
          )}
        </div>

        <div className="bg-surface-low flex items-center justify-between border-t border-slate-light/20 px-8 py-5">
          <button className="flex items-center gap-2 text-sm text-slate-medium hover:text-primary transition-colors">
            <CopyIcon className="w-4 h-4" />
            <span className="font-medium">Copy link</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-surface-highest px-5 py-2 text-sm font-semibold text-slate-dark hover:bg-slate-light/30 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/*  Metadata */}
      <aside className="border-l border-slate-light/20 bg-surface-low p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* Status */}
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
              Status
            </p>
            <div className={`rounded-lg ${getStatusBadgeStyle(task.status)}`}>
              <TaskStatusSelect
                value={task.status}
                onChange={() => {}}
                isDisabled={true}
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
              Assignee
            </p>
            <div className="rounded-xl bg-white p-3">
              <UserAvatar
                name={task.assignee?.name}
                jobTitle={task.assignee?.department}
                size="md"
                showName={true}
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
              Reporter
            </p>
            {task.created_by ? (
              <div className="flex items-center gap-3">
                <UserAvatar name={task.created_by.name} size="md" />
                <span className="text-sm text-slate-dark font-medium">
                  {task.created_by.name}
                </span>
              </div>
            ) : (
              <p className="text-sm text-slate-medium font-normal">Unknown</p>
            )}
          </div>

          <hr className="border-slate-light/20" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-medium">Due Date</span>
              <span className="text-sm font-medium text-slate-dark">
                {task.due_date ? formatDate(task.due_date) : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-medium">Created At</span>
              <span className="text-sm font-medium text-slate-dark">
                {formatDate(task.created_at)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
