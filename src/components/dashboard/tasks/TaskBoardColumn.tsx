import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TaskStatus, TASK_STATUS_LABELS } from '../../../types/task';
import { getTasksByStatus } from '../../../api/taskApi';
import TaskCard from './TaskCard';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../constants/routes';
import PlusCircleIcon from '../../../assets/icons/plusCircle.svg?react';
import Spinner from '../../ui/spinner';

interface TaskBoardColumnProps {
  status: TaskStatus;
}

interface TaskData {
  id: string;
  title: string;
  due_date: string | null;
  assignee: {
    sub: string;
    name: string;
    email: string;
  } | null;
}

const TaskBoardColumn: React.FC<TaskBoardColumnProps> = ({ status }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        const data = await getTasksByStatus(projectId, status);
        setTasks(data);
      } catch (error) {
        toast.error('Failed to load tasks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, [projectId, status]);

  const handleAddTask = () => {
    if (!projectId) return;
    navigate(`${ROUTES.ADD_TASK(projectId)}?status=${status}`);
  };

  // Status color mapping

  const getHeaderDotColor = () => {
    switch (status) {
      case TaskStatus.TO_DO:
        return 'bg-slate-dark';
      case TaskStatus.IN_PROGRESS:
        return 'bg-primary-container';
      case TaskStatus.BLOCKED:
        return 'bg-error';
      case TaskStatus.IN_REVIEW:
        return 'bg-slate-dark';
      case TaskStatus.READY_FOR_QA:
        return 'bg-slate-medium';
      case TaskStatus.REOPENED:
        return 'bg-surface-dark';
      case TaskStatus.READY_FOR_PRODUCTION:
        return 'bg-warning';
      case TaskStatus.DONE:
        return 'bg-success';
      default:
        return 'bg-slate-400';
    }
  };

  const getCountBadgeStyle = () => {
    if (status === TaskStatus.BLOCKED) {
      return 'bg-error-background text-error';
    }
    return 'bg-slate-light/60 text-slate-dark';
  };

  return (
    <div className="flex flex-col gap-4 min-w-[320px] shrink-0">
      {/* Column Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getHeaderDotColor()}`} />
          <h3 className="text-label-sm font-bold uppercase text-slate-dark">
            {TASK_STATUS_LABELS[status]}
          </h3>
          <span
            className={`text-label-sm font-bold px-1.5 py-0.5 rounded-sm min-w-[1.25rem] flex items-center justify-center ${getCountBadgeStyle()}`}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={handleAddTask}
          className="p-1.5 rounded-full hover:bg-surface-low transition-colors"
          title="Add new task"
        >
          <PlusCircleIcon className="w-4 h-4 text-slate-medium hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Tasks List */}
      <div className=" flex flex-col gap-3 p-3 rounded-lg min-h-[400px]">
        {/* Add New Task Button */}
        <button
          onClick={handleAddTask}
          className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-slate-light/60 hover:border-primary/40 hover:bg-primary/5 transition-all text-slate-medium hover:text-primary"
        >
          <PlusCircleIcon className="w-4 h-4" />
          <span className="text-body-sm font-medium">ADD NEW TASK</span>
        </button>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-slate-medium text-body-sm">No tasks</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              dueDate={task.due_date}
              assignee={task.assignee}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskBoardColumn;
