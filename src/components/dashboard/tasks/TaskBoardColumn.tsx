import { useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/hooks';
import { useTasksSearch } from '../../../hooks/useTasksSearch';
import { useTasksByStatus } from '../../../hooks/queries/useTasks';
import { openTaskDetails } from '../../../redux/slices/taskModalSlice';
import { TaskStatus, TASK_STATUS_LABELS } from '../../../types/task';
import { getTasksByStatus } from '../../../api/taskApi';
import TaskCard from './TaskCard';
import TaskCardSkeleton from './TaskCardSkeleton';
import { getStatusDotColor } from '../../../constants/taskStyles';
import toast from 'react-hot-toast';
import { ROUTES } from '../../../constants/routes';
import PlusCircleIcon from '../../../assets/icons/plusCircle.svg?react';
import { useState } from 'react';

interface TaskBoardColumnProps {
  status: TaskStatus;
}

interface TaskData {
  id: string;
  title: string;
  due_date: string | null;
  assignee: {
    name: string;
  } | null;
}

const TaskBoardColumn: React.FC<TaskBoardColumnProps> = ({ status }) => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { debouncedSearch } = useTasksSearch();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [displayedTasks, setDisplayedTasks] = useState<TaskData[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const pageSize = 5;

  // React Query - fetch initial tasks
  const { data: tasksResponse, isLoading } = useTasksByStatus(
    projectId || '',
    status,
    pageSize,
    0,
    debouncedSearch
  );

  const initialTasks = tasksResponse?.data || [];
  const totalCount = tasksResponse?.totalCount || 0;

  // Update displayed tasks when initialTasks change
  if (initialTasks.length > 0 && displayedTasks.length === 0) {
    setDisplayedTasks(initialTasks);
  }

  // Reset displayed tasks when search changes
  if (
    initialTasks.length > 0 &&
    displayedTasks.length > 0 &&
    initialTasks[0]?.id !== displayedTasks[0]?.id
  ) {
    setDisplayedTasks(initialTasks);
  }

  const hasMore = displayedTasks.length < totalCount;

  // Load more tasks
  const loadMore = useCallback(async () => {
    if (!projectId || isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const offset = displayedTasks.length;
      const response = await getTasksByStatus(
        projectId,
        status,
        pageSize,
        offset,
        debouncedSearch
      );

      setDisplayedTasks(prev => [...prev, ...response.data]);
    } catch {
      toast.error('Failed to load more tasks');
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    projectId,
    status,
    displayedTasks.length,
    isLoadingMore,
    hasMore,
    debouncedSearch,
  ]);

  // Intersection Observer for infinite scroll
  const lastTaskRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isLoadingMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, isLoadingMore, hasMore, loadMore]
  );

  const handleAddTask = () => {
    if (!projectId) return;
    navigate(`${ROUTES.ADD_TASK(projectId)}?status=${status}`);
  };

  return (
    <div className="flex flex-col gap-4 min-w-[320px] shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`}
          />
          <h3 className="text-label-sm font-bold uppercase text-slate-dark">
            {TASK_STATUS_LABELS[status]}
          </h3>
          <span
            className={`text-label-sm font-bold px-1.5 py-0.5 rounded-sm min-w-5 flex items-center justify-center ${
              status === TaskStatus.BLOCKED
                ? 'bg-error-background text-error'
                : 'bg-slate-light/60 text-slate-dark'
            }`}
          >
            {totalCount}
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
      <div className="flex flex-col gap-3 p-3 rounded-lg min-h-[400px] overflow-y-auto max-h-[calc(100vh-250px)]">
        <button
          onClick={handleAddTask}
          className="flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-slate-light/60 hover:border-primary/40 hover:bg-primary/5 transition-all text-slate-medium hover:text-primary"
        >
          <PlusCircleIcon className="w-4 h-4" />
          <span className="text-body-sm font-medium">ADD NEW TASK</span>
        </button>

        {isLoading ? (
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))}
          </>
        ) : displayedTasks.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-slate-medium text-body-sm">No tasks</p>
          </div>
        ) : (
          <>
            {displayedTasks.map((task, index) => {
              //  ref to last task for infinite scroll
              if (index === displayedTasks.length - 1) {
                return (
                  <div key={task.id} ref={lastTaskRef}>
                    <TaskCard
                      id={task.id}
                      title={task.title}
                      dueDate={task.due_date}
                      assignee={task.assignee}
                      onClick={() => dispatch(openTaskDetails(task.id))}
                    />
                  </div>
                );
              }
              return (
                <TaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  dueDate={task.due_date}
                  assignee={task.assignee}
                  onClick={() => dispatch(openTaskDetails(task.id))}
                />
              );
            })}

            {isLoadingMore && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskBoardColumn;
