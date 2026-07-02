import UserAvatar from '../../../ui/UserAvatar';
import TaskStatusSelect from './TaskStatusSelect';
import EditableTaskTitle from './editable/EditableTaskTitle';
import EditableTaskDescription from './editable/EditableTaskDescription';
import EditableTaskAssignee from './editable/EditableTaskAssignee';
import EditableTaskDueDate from './editable/EditableTaskDueDate';
import EditableTaskEpic from './editable/EditableTaskEpic';
import { formatDate } from '../../../../utils/formatDate';
import { getStatusBadgeStyle } from '../../../../constants/taskStyles';
import type { TaskDetails } from '../../../../types/task';
import { useUpdateTask } from '../../../../hooks/tasks';
import { useProjectMembers } from '../../../../hooks/queries/useMembers';
import EpicIdIcon from '../../../../assets/icons/epicId.svg?react';
import CopyIcon from '../../../../assets/icons/copy.svg?react';

interface TaskDetailsDesktopProps {
  task: TaskDetails;
  onClose: () => void;
  projectId: string;
}

export default function TaskDetailsDesktop({
  task,
  onClose,
  projectId,
}: TaskDetailsDesktopProps) {
  const { mutate: updateTask, isPending: isSaving } = useUpdateTask();
  const { data: members = [], isError: membersError } =
    useProjectMembers(projectId);

  const handleUpdateField = (
    field: keyof TaskDetails,
    value: string | null
  ) => {
    updateTask({
      taskId: task.id,
      projectId,
      data: { [field]: value },
    });
  };

  const handleTitleUpdate = (value: string) => {
    handleUpdateField('title', value);
  };

  const handleDescriptionUpdate = (value: string | null) => {
    handleUpdateField('description', value);
  };

  const handleAssigneeUpdate = (userId: string | null) => {
    updateTask({
      taskId: task.id,
      projectId,
      data: { assignee_id: userId },
    });
  };

  const handleDueDateUpdate = (date: string | null) => {
    handleUpdateField('due_date', date);
  };

  const handleEpicUpdate = (epicId: string | null) => {
    handleUpdateField('epic_id', epicId);
  };

  const handleStatusUpdate = (status: string) => {
    handleUpdateField('status', status);
  };

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
          <EditableTaskTitle
            title={task.title}
            isSaving={isSaving}
            onUpdate={handleTitleUpdate}
          />
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          <EditableTaskDescription
            description={task.description}
            isSaving={isSaving}
            onUpdate={handleDescriptionUpdate}
          />
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
                onChange={handleStatusUpdate}
                isDisabled={isSaving}
              />
            </div>
          </div>

          <EditableTaskAssignee
            assignee={task.assignee}
            projectMembers={members}
            isError={membersError}
            isSaving={isSaving}
            onUpdate={handleAssigneeUpdate}
          />

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

          <EditableTaskDueDate
            dueDate={task.due_date}
            isSaving={isSaving}
            onUpdate={handleDueDateUpdate}
          />

          <EditableTaskEpic
            epic={task.epic || null}
            projectId={projectId}
            isSaving={isSaving}
            onUpdate={handleEpicUpdate}
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-medium">Created At</span>
            <span className="text-sm font-medium text-slate-dark">
              {formatDate(task.created_at)}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
