import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Badge from '../../ui/badge';
import UserAvatar from '../../ui/UserAvatar';
import TaskListItemSkeleton from './TaskListItemSkeleton';
import { TaskStatus, TASK_STATUS_LABELS } from '../../../types/task';
import { getAllProjectTasks } from '../../../api/taskApi';
import { formatDate } from '../../../utils/formatDate';
import toast from 'react-hot-toast';
import MoreVerticalIcon from '../../../assets/icons/more-vertical.svg?react';
import MoreHorizontalIcon from '../../../assets/icons/more-horizontal.svg?react';

interface TaskData {
  id: string;
  task_id: string;
  title: string;
  status: string;
  due_date: string | null;
  assignee: {
    sub: string;
    name: string;
    email: string;
  } | null;
}

const TasksList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProjectTasks(projectId);
        setTasks(data);
      } catch {
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [projectId]);

  const thStyle =
    'text-secondary py-4 px-6 font-bold text-label-sm uppercase tracking-wide text-left';
  const tdStyle = 'py-4 px-6 text-body text-slate-dark';

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case TaskStatus.TO_DO:
        return 'bg-slate-light/30 text-slate-dark';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-700';
      case TaskStatus.BLOCKED:
        return 'bg-error-background text-error-dark';
      case TaskStatus.IN_REVIEW:
        return 'bg-yellow-100 text-yellow-700';
      case TaskStatus.READY_FOR_QA:
        return 'bg-purple-100 text-purple-700';
      case TaskStatus.REOPENED:
        return 'bg-orange-100 text-orange-700';
      case TaskStatus.READY_FOR_PRODUCTION:
        return 'bg-teal-100 text-teal-700';
      case TaskStatus.DONE:
        return 'bg-success-background text-success-dark';
      default:
        return 'bg-slate-light/30 text-slate-dark';
    }
  };

  if (isLoading) {
    return (
      <>
        {/* Desktop Skeleton */}
        <div className="hidden lg:block rounded-lg shadow-sm overflow-hidden border border-surface-high">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-transparent">
                <tr className="border-b border-slate-light/20">
                  <th className={`${thStyle} w-32`}>Task ID</th>
                  <th className={`${thStyle} w-1/4`}>Title</th>
                  <th className={`${thStyle} w-1/6`}>Status</th>
                  <th className={`${thStyle} w-1/6`}>Due Date</th>
                  <th className={`${thStyle} w-1/6`}>Assignee</th>
                  <th className={`${thStyle} w-16`}></th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TaskListItemSkeleton key={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Skeleton */}
        <div className="lg:hidden space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-4 border border-surface-high"
            >
              <div className="h-4 w-20 bg-surface-highest rounded animate-pulse mb-2" />
              <div className="h-5 w-full bg-surface-highest rounded animate-pulse mb-3" />
              <div className="flex items-center gap-2 mb-2">
                <div className="h-6 w-20 bg-surface-highest rounded animate-pulse" />
                <div className="h-4 w-24 bg-surface-highest rounded animate-pulse" />
              </div>
              <div className="h-4 w-32 bg-surface-highest rounded animate-pulse" />
            </div>
          ))}
        </div>
      </>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white rounded-lg p-20 text-center border border-surface-high">
        <p className="text-slate-medium text-body-lg">No tasks found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-lg shadow-sm overflow-hidden border border-surface-high">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-transparent">
              <tr className="border-b border-slate-light/20">
                <th className={`${thStyle} w-32`}>Task ID</th>
                <th className={`${thStyle} w-1/4`}>Title</th>
                <th className={`${thStyle} w-1/6`}>Status</th>
                <th className={`${thStyle} w-1/6`}>Due Date</th>
                <th className={`${thStyle} w-1/6`}>Assignee</th>
                <th className={`${thStyle} w-16`}></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tasks.map(task => (
                <tr
                  key={task.id}
                  className="border-b border-slate-light/20 hover:bg-surface-low/20 transition-colors"
                >
                  {/* Task ID */}
                  <td className={tdStyle}>
                    <span className="uppercase text-primary font-medium">
                      {task.task_id}
                    </span>
                  </td>

                  {/* Title */}
                  <td className={tdStyle}>
                    <h3 className="font-medium text-slate-dark line-clamp-2">
                      {task.title}
                    </h3>
                  </td>

                  {/* Status */}
                  <td className={tdStyle}>
                    <Badge
                      className={`py-1 px-3 text-label-sm rounded-xs ${getStatusBadgeStyle(task.status)}`}
                    >
                      {TASK_STATUS_LABELS[task.status as TaskStatus] ||
                        task.status}
                    </Badge>
                  </td>

                  {/* Due Date */}
                  <td className={`${tdStyle} text-slate-medium`}>
                    {task.due_date ? formatDate(task.due_date) : '-'}
                  </td>

                  {/* Assignee */}
                  <td className={tdStyle}>
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={task.assignee?.name}
                        size="sm"
                        variant="auto"
                      />
                      <span className="text-slate-dark">
                        {task.assignee?.name || 'Unassigned'}
                      </span>
                    </div>
                  </td>

                  {/* Actions - Horizontal dots on desktop */}
                  <td className={`${tdStyle} text-center`}>
                    <button
                      className="p-1.5 hover:bg-surface-low rounded transition-colors"
                      aria-label="Task actions"
                    >
                      <MoreHorizontalIcon className="w-5 h-5 text-slate-medium" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white border-t border-slate-light/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-body-sm text-slate-medium">
            <span>Showing</span>
            <span className="font-medium text-slate-dark">
              1-{tasks.length}
            </span>
            <span>of</span>
            <span className="font-medium text-slate-dark">{tasks.length}</span>
            <span>tasks</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 border border-slate-light/40 rounded text-body-sm text-slate-medium hover:bg-surface-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1.5 bg-primary text-white rounded text-body-sm font-medium">
              1
            </button>
            <button
              className="px-3 py-1.5 border border-slate-light/40 rounded text-body-sm text-slate-medium hover:bg-surface-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {tasks.map(task => (
          <div
            key={task.id}
            className="bg-white rounded-lg p-4 border border-surface-high"
          >
            {/* Top row: Task ID on left, Badge and Dots stacked on right */}
            <div className="flex items-start justify-between mb-3">
              <p className="text-label-sm text-secondary uppercase font-semibold">
                {task.task_id}
              </p>

              {/* Right column: Badge on top, Dots below */}
              <div className="flex flex-col items-end gap-2">
                <Badge
                  className={`py-1 px-2 text-label-xs rounded-xs uppercase ${getStatusBadgeStyle(task.status)}`}
                >
                  {TASK_STATUS_LABELS[task.status as TaskStatus] || task.status}
                </Badge>

                <button
                  className="p-1 hover:bg-surface-low rounded transition-colors"
                  aria-label="Task actions"
                >
                  <MoreVerticalIcon className="w-5 h-5 text-slate-medium" />
                </button>
              </div>
            </div>

            {/* Title (larger font) */}
            <h3 className="font-semibold text-slate-dark text-body-lg mb-4 leading-6">
              {task.title}
            </h3>

            {/* Bottom row: Avatar + Due Date on left */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <UserAvatar name={task.assignee?.name} size="sm" variant="auto" />

              {/* Due Date (vertical stack) */}
              <div className="flex flex-col">
                <span className="text-label-xs font-bold text-secondary uppercase tracking-wide">
                  DUE DATE
                </span>
                <span className="text-body-sm text-slate-dark">
                  {task.due_date ? formatDate(task.due_date) : '-'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default TasksList;
