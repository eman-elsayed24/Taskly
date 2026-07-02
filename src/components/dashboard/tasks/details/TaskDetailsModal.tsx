import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TaskDetailsSkeleton from './TaskDetailsSkeleton';
import TaskDetailsDesktop from './TaskDetailsDesktop';
import TaskDetailsMobile from './TaskDetailsMobile';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { closeTaskDetails } from '../../../../redux/slices/taskModalSlice';
import { useTaskDetails } from '../../../../hooks/tasks';

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

export default function TaskDetailsModal() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const taskId = useAppSelector(state => state.taskModal.selectedTaskId);

  const {
    data: task,
    isLoading,
    isError: error,
  } = useTaskDetails(projectId || '', taskId || '');

  const onClose = useCallback(() => {
    dispatch(closeTaskDetails());
  }, [dispatch]);

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
          ) : !task ? (
            <ErrorState onClose={onClose} />
          ) : (
            <TaskDetailsDesktop
              task={task}
              onClose={onClose}
              projectId={projectId}
            />
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
          ) : !task ? (
            <ErrorState onClose={onClose} />
          ) : (
            <TaskDetailsMobile
              task={task}
              onClose={onClose}
              projectId={projectId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
