import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Badge from '../../ui/badge';
import { TaskStatus, TASK_STATUS_LABELS } from '../../../types/task';
import { getAllProjectTasks } from '../../../api/taskApi';
import { formatDate } from '../../../utils/formatDate';
import toast from 'react-hot-toast';
import Spinner from '../../ui/spinner';

interface TaskData {
  id: string;
  title: string;
  status: TaskStatus;
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
      } catch (error) {
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

  const getStatusBadgeStyle = (status: TaskStatus) => {
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

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string | null | undefined) => {
    if (!name) return 'bg-slate-400';
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500',
      'bg-orange-500',
      'bg-cyan-500',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-slate-medium text-body-lg">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-surface-high">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-surface-low/30 border-b border-slate-light/10">
              <th className={`${thStyle} w-1/5`}>Title</th>
              <th className={`${thStyle} w-1/6`}>Status</th>
              <th className={`${thStyle} w-1/6`}>Due Date</th>
              <th className={`${thStyle} w-1/6`}>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr
                key={task.id}
                className="border-b border-surface-low hover:bg-surface-low/20 transition-colors"
              >
                <td className={tdStyle}>
                  <h3 className="font-medium text-slate-dark line-clamp-2">
                    {task.title}
                  </h3>
                </td>
                <td className={tdStyle}>
                  <Badge
                    className={`py-1 px-3 text-label-sm ${getStatusBadgeStyle(task.status)}`}
                  >
                    {TASK_STATUS_LABELS[task.status]}
                  </Badge>
                </td>
                <td className={`${tdStyle} text-slate-medium`}>
                  {task.due_date ? formatDate(task.due_date) : '-'}
                </td>
                <td className={tdStyle}>
                  {task.assignee ? (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-label-sm font-bold ${getAvatarColor(task.assignee.name)}`}
                      >
                        {getInitials(task.assignee.name)}
                      </div>
                      <span className="text-slate-dark">
                        {task.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-medium">Unassigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TasksList;
