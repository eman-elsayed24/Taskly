import UserAvatar from '../../../ui/UserAvatar';
import EditableTaskTitle from './editable/EditableTaskTitle';
import EditableTaskDescription from './editable/EditableTaskDescription';
import EditableTaskAssignee from './editable/EditableTaskAssignee';
import EditableTaskDueDate from './editable/EditableTaskDueDate';
import EditableTaskEpic from './editable/EditableTaskEpic';
import TaskStatusSelect from './TaskStatusSelect';
import { formatDate } from '../../../../utils/formatDate';
import type { TaskDetails } from '../../../../types/task';
import { getStatusBadgeStyle } from '../../../../constants/taskStyles';
import { useUpdateTask } from '../../../../hooks/tasks';
import { useProjectMembers } from '../../../../hooks/queries/useMembers';
import EpicIdIcon from '../../../../assets/icons/epicId.svg?react';

interface TaskDetailsMobileProps {
  task: TaskDetails;
  onClose: () => void;
  projectId: string;
}

export default function TaskDetailsMobile({
  task,
  onClose,
  projectId,
}: TaskDetailsMobileProps) {
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

        <div className="mb-5">
          <EditableTaskTitle
            title={task.title}
            isSaving={isSaving}
            onUpdate={handleTitleUpdate}
          />
        </div>

        {/* Status + Epic */}
        <div className="mb-6 flex flex-wrap gap-2">
          <div className={`rounded-xl ${getStatusBadgeStyle(task.status)}`}>
            <TaskStatusSelect
              value={task.status}
              onChange={handleStatusUpdate}
              isDisabled={isSaving}
            />
          </div>
          {task.epic?.epic_id && (
            <span className="flex items-center gap-1 rounded-full bg-surface-highest px-3 py-1 text-xs font-bold text-slate-dark">
              <EpicIdIcon className="w-3 h-3" />
              {task.epic.epic_id}
            </span>
          )}
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3">
          {/* Assignee */}
          <div className="col-span-2">
            <EditableTaskAssignee
              assignee={task.assignee}
              projectMembers={members}
              isError={membersError}
              isSaving={isSaving}
              onUpdate={handleAssigneeUpdate}
            />
          </div>

          {/* Due Date */}
          <EditableTaskDueDate
            dueDate={task.due_date}
            isSaving={isSaving}
            onUpdate={handleDueDateUpdate}
          />

          {/* Epic */}
          <EditableTaskEpic
            epic={task.epic || null}
            projectId={projectId}
            isSaving={isSaving}
            onUpdate={handleEpicUpdate}
          />

          {/* Reporter */}
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

          {/* Created At */}
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
          <EditableTaskDescription
            description={task.description}
            isSaving={isSaving}
            onUpdate={handleDescriptionUpdate}
            variant="mobile"
          />
        </div>
      </div>
    </>
  );
}
