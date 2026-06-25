import { useEffect, useState } from 'react';
import Modal from '../../ui/Modal';
import Badge from '../../ui/badge';
import UserAvatar from '../../ui/UserAvatar';
import TaskDetailsSkeleton from './TaskDetailsSkeleton';
import { getTaskById } from '../../../api/taskApi';
import { formatDate } from '../../../utils/formatDate';
import {
  TaskStatus,
  TASK_STATUS_LABELS,
  type TaskDetails,
} from '../../../types/task';
import { getStatusBadgeStyle } from '../../../constants/taskStyles';
import toast from 'react-hot-toast';

interface TaskDetailsModalProps {
  taskId: string;
  projectId: string;
  onClose: () => void;
}

export default function TaskDetailsModal({
  taskId,
  projectId,
  onClose,
}: TaskDetailsModalProps) {
  const [task, setTask] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!taskId || !projectId) return;

    let isMounted = true;

    const fetchTaskDetails = async () => {
      setIsLoading(true);
      setError(false);

      try {
        const data = await getTaskById(projectId, taskId);
        if (isMounted) {
          setTask(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          toast.error('Failed to load task details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTaskDetails();

    return () => {
      isMounted = false;
    };
  }, [taskId, projectId]);

  return (
    <Modal isOpen onClose={onClose}>
      {/* Modal Title */}
      <h2 className="text-heading-sm text-slate-dark border-b border-slate-light/20 pb-4 mb-6">
        Task Details
      </h2>

      {isLoading ? (
        <TaskDetailsSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="text-error text-body-lg mb-2">
            Failed to load task details
          </div>
          <button
            onClick={onClose}
            className="text-primary text-body-sm hover:underline"
          >
            Close
          </button>
        </div>
      ) : !task ? (
        <div className="flex flex-col items-center justify-center py-12 px-6">
          <div className="text-slate-medium text-body-lg">Task not found</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Task ID */}
          <div>
            <p className="text-label-sm text-secondary uppercase mb-1">
              Task ID
            </p>
            <p className="text-body-lg text-primary font-semibold uppercase">
              {task.task_id}
            </p>
          </div>

          {/* Title */}
          <div>
            <p className="text-label-sm text-secondary uppercase mb-2">Title</p>
            <h2 className="text-heading-sm text-slate-dark">{task.title}</h2>
          </div>

          {/* Status Badge */}
          <div>
            <p className="text-label-sm text-secondary uppercase mb-2">
              Status
            </p>
            <Badge
              className={`py-1 px-3 text-label-sm rounded-xs ${getStatusBadgeStyle(task.status)}`}
            >
              {TASK_STATUS_LABELS[task.status as TaskStatus] || task.status}
            </Badge>
          </div>

          {/* Description */}
          <div>
            <p className="text-label-sm text-secondary uppercase mb-2">
              Description
            </p>
            {task.description ? (
              <p className="text-body text-slate-dark whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="text-body text-slate-medium italic">
                No description provided
              </p>
            )}
          </div>

          {/* Assignee & Reporter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Assignee */}
            <div>
              <p className="text-label-sm text-secondary uppercase mb-3">
                Assignee
              </p>
              {task.assignee ? (
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={task.assignee.name}
                    size="md"
                    variant="auto"
                  />
                  <div>
                    <p className="text-body text-slate-dark font-medium">
                      {task.assignee.name}
                    </p>
                    <p className="text-body-sm text-slate-medium">
                      {task.assignee.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-body text-slate-medium italic">Unassigned</p>
              )}
            </div>

            {/* Reporter */}
            <div>
              <p className="text-label-sm text-secondary uppercase mb-3">
                Reporter
              </p>
              {task.reporter ? (
                <div className="flex items-center gap-3">
                  <UserAvatar
                    name={task.reporter.name}
                    size="md"
                    variant="auto"
                  />
                  <div>
                    <p className="text-body text-slate-dark font-medium">
                      {task.reporter.name}
                    </p>
                    <p className="text-body-sm text-slate-medium">
                      {task.reporter.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-body text-slate-medium italic">Unknown</p>
              )}
            </div>
          </div>

          {/* Due Date & Created At */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Due Date */}
            <div>
              <p className="text-label-sm text-secondary uppercase mb-2">
                Due Date
              </p>
              <p className="text-body text-slate-dark">
                {task.due_date ? formatDate(task.due_date) : '—'}
              </p>
            </div>

            {/* Created At */}
            <div>
              <p className="text-label-sm text-secondary uppercase mb-2">
                Created At
              </p>
              <p className="text-body text-slate-dark">
                {formatDate(task.created_at)}
              </p>
            </div>
          </div>

          {/* Epic */}
          {task.epic_id && (
            <div>
              <p className="text-label-sm text-secondary uppercase mb-2">
                Epic
              </p>
              <p className="text-body text-primary font-medium">
                {task.epic_id}
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
