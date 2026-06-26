import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskDetailsSkeleton from './TaskDetailsSkeleton';
import TaskDetailsDesktop from './TaskDetailsDesktop';
import TaskDetailsMobile from './TaskDetailsMobile';
import { getTaskById } from '../../../../api/taskApi';
import type { TaskDetails } from '../../../../types/task';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { closeTaskDetails } from '../../../../redux/slices/taskModalSlice';
import toast from 'react-hot-toast';

const ErrorState = ({ onClose }: { onClose: () => void }) => (
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
);

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center py-12 px-6">
    <div className="text-slate-medium text-body-lg">Task not found</div>
  </div>
);

export default function TaskDetailsModal() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const taskId = useAppSelector(state => state.taskModal.selectedTaskId);

  const [task, setTask] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const onClose = useCallback(() => {
    dispatch(closeTaskDetails());
  }, [dispatch]);

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
      } catch {
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

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  if (!taskId || !projectId) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
    >
      {/* Desktop  */}
      <div className="hidden md:flex md:items-center md:justify-center md:h-full md:p-4">
        <div
          onClick={e => e.stopPropagation()}
          className="w-full max-w-4xl h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl"
        >
          {isLoading ? (
            <TaskDetailsSkeleton />
          ) : error ? (
            <ErrorState onClose={onClose} />
          ) : !task ? (
            <NotFoundState />
          ) : (
            <TaskDetailsDesktop task={task} onClose={onClose} />
          )}
        </div>
      </div>

      {/* Mobile  */}
      <div className="md:hidden flex items-end h-full">
        <div
          onClick={e => e.stopPropagation()}
          className="w-full max-h-[90vh] overflow-y-auto rounded-t-2xl bg-surface-low shadow-xl"
        >
          {isLoading ? (
            <div className="p-6">
              <TaskDetailsSkeleton />
            </div>
          ) : error ? (
            <ErrorState onClose={onClose} />
          ) : !task ? (
            <NotFoundState />
          ) : (
            <TaskDetailsMobile task={task} onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}
