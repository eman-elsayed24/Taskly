import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../../../redux/hooks';
import { openTaskDetails } from '../../../redux/slices/taskModalSlice';
import Badge from '../../ui/badge';
import UserAvatar from '../../ui/UserAvatar';
import TasksPagination from './TasksPagination';
import InfiniteScrollLoader from '../../ui/InfiniteScrollLoader';
import TasksListSkeleton from './TasksListSkeleton';
import { TaskStatus, TASK_STATUS_LABELS } from '../../../types/task';
import { getAllProjectTasks } from '../../../api/taskApi';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll';
import { formatDate } from '../../../utils/formatDate';
import { getStatusBadgeStyle } from '../../../constants/taskStyles';
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
    name: string;
  } | null;
}

const TasksList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const [initialTasks, setInitialTasks] = useState<TaskData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;

  const totalPages = Math.ceil(totalCount / pageSize);

  // Infinite scroll hook for mobile
  const {
    items: displayedTasks,
    loading: isLoadingMore,
    hasMore,
    observerTarget,
  } = useInfiniteScroll({
    initialItems: initialTasks,
    totalCount: totalCount,
    pageSize,
    fetchMore: async (offset, limit) => {
      if (!projectId) throw new Error('No project ID');
      const response = await getAllProjectTasks(projectId, limit, offset);
      return { data: response.data, totalCount: response.totalCount };
    },
  });

  // Load initial data when projectId changes
  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    const fetchTasks = async () => {
      setIsLoading(true);
      setCurrentPage(1);
      try {
        const response = await getAllProjectTasks(projectId, pageSize, 0);
        if (isMounted) {
          setInitialTasks(response.data);
          setTotalCount(response.totalCount);
        }
      } catch {
        if (isMounted) {
          toast.error('Failed to load tasks');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchTasks();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Load page when currentPage changes (desktop pagination only)
  useEffect(() => {
    if (!projectId || currentPage === 1) return;

    let isMounted = true;

    const loadPage = async () => {
      setIsLoading(true);
      try {
        const offset = (currentPage - 1) * pageSize;
        const response = await getAllProjectTasks(projectId, pageSize, offset);
        if (isMounted) {
          setInitialTasks(response.data);
          setTotalCount(response.totalCount);
        }
      } catch {
        if (isMounted) {
          toast.error('Failed to load tasks');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [projectId, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const thStyle =
    'text-secondary py-3 px-6 font-bold text-label-sm uppercase tracking-wide text-left';
  const tdStyle = 'py-3.5 px-6 text-body text-slate-dark';

  if (isLoading) {
    return <TasksListSkeleton />;
  }

  if (displayedTasks.length === 0) {
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
              {initialTasks.map(task => (
                <tr
                  key={task.id}
                  className="border-b border-slate-light/20 hover:bg-surface-low/20 transition-colors cursor-pointer"
                  onClick={() => dispatch(openTaskDetails(task.id))}
                >
                  <td className={tdStyle}>
                    <span className="uppercase text-primary font-medium">
                      {task.task_id}
                    </span>
                  </td>

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

                  <td className={`${tdStyle} text-slate-medium`}>
                    {task.due_date ? formatDate(task.due_date) : '-'}
                  </td>

                  <td className={tdStyle}>
                    <div className="flex items-center gap-3">
                      <UserAvatar name={task.assignee?.name} size="sm" />
                      <span className="text-slate-dark">
                        {task.assignee?.name || 'Unassigned'}
                      </span>
                    </div>
                  </td>

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

        {/* Desktop Pagination */}
        <TasksPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {displayedTasks.map(task => (
          <div
            key={task.id}
            className="bg-white rounded-lg p-4 border border-surface-high cursor-pointer"
            onClick={() => dispatch(openTaskDetails(task.id))}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-label-sm text-secondary uppercase font-semibold">
                {task.task_id}
              </p>

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

            <h3 className="font-semibold text-slate-dark text-body-lg mb-4 leading-6">
              {task.title}
            </h3>

            <div className="flex items-center gap-3">
              <UserAvatar name={task.assignee?.name} size="sm" variant="info" />

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

      {/* Infinite Scroll Loader for Mobile */}
      <InfiniteScrollLoader
        loading={isLoadingMore}
        hasMore={hasMore}
        observerTarget={observerTarget}
      />
    </>
  );
};

export default TasksList;
