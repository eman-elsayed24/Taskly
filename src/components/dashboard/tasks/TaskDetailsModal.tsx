import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Badge from '../../ui/badge';
import UserAvatar from '../../ui/UserAvatar';
import TaskDetailsSkeleton from './TaskDetailsSkeleton';
import TaskStatusSelect from './TaskStatusSelect';
import { getTaskById } from '../../../api/taskApi';
import { formatDate } from '../../../utils/formatDate';
import {
  TaskStatus,
  TASK_STATUS_LABELS,
  type TaskDetails,
} from '../../../types/task';
import { getStatusBadgeStyle } from '../../../constants/taskStyles';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { closeTaskDetails } from '../../../redux/slices/taskModalSlice';
import toast from 'react-hot-toast';
import EpicIdIcon from '../../../assets/icons/epicId.svg?react';
import CopyIcon from '../../../assets/icons/copy.svg?react';

export default function TaskDetailsModal() {
  const { projectId } = useParams<{ projectId: string }>();
  const dispatch = useAppDispatch();
  const taskId = useAppSelector(state => state.taskModal.selectedTaskId);

  const [task, setTask] = useState<TaskDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const onClose = () => dispatch(closeTaskDetails());

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

  if (!taskId || !projectId) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
    >
      {/* Desktop - Centered Modal */}
      <div className="hidden md:flex md:items-center md:justify-center md:h-full md:p-4">
        <div
          onClick={e => e.stopPropagation()}
          className="w-full max-w-4xl h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl"
        >
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
              <div className="text-slate-medium text-body-lg">
                Task not found
              </div>
            </div>
          ) : (
            <div className="h-full grid grid-cols-[1fr_320px]">
          
              <div className="flex flex-col">
                {/* Header */}
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
                  <h1 className="max-w-3xl text-3xl font-bold leading-tight text-slate-dark">
                    {task.title}
                  </h1>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-medium">
                    Description
                  </h3>
                  {task.description ? (
                    <p className="max-w-3xl text-sm text-slate-dark leading-relaxed whitespace-pre-wrap">
                      {task.description}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-medium italic">
                      No description provided
                    </p>
                  )}
                </div>

                {/* Footer */}
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

              {/* Right Side - Metadata */}
              <aside className="border-l border-slate-light/20 bg-surface-low p-6 overflow-y-auto">
                <div className="space-y-6">
                  {/* Status */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
                      Status
                    </p>
                    <div
                      className={`rounded-lg ${getStatusBadgeStyle(task.status)}`}
                    >
                      <TaskStatusSelect
                        value={task.status}
                        onChange={() => {}}
                      />
                    </div>
                  </div>

                  {/* Assignee */}
                  <div>
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
                      Assignee
                    </p>
                    <div className="rounded-xl bg-white p-3">
                      <UserAvatar
                        name={task.assignee?.name}
                        jobTitle={task.assignee?.department}
                        size="md"
                        showName={true}
                      />
                    </div>
                  </div>

                  
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
                      <p className="text-sm text-slate-medium font-normal">
                        Unknown
                      </p>
                    )}
                  </div>

                  <hr className="border-slate-light/20" />

                  {/* Dates */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-medium">
                        Due Date
                      </span>
                      <span className="text-sm font-medium text-slate-dark">
                        {task.due_date ? formatDate(task.due_date) : '—'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-medium">
                        Created At
                      </span>
                      <span className="text-sm font-medium text-slate-dark">
                        {formatDate(task.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>

   
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
              <div className="text-slate-medium text-body-lg">
                Task not found
              </div>
            </div>
          ) : (
            <>
            
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

                
                <h1 className="mb-5 text-2xl font-semibold leading-tight text-slate-dark">
                  {task.title}
                </h1>

               
                <div className="mb-6 flex flex-wrap gap-2">
                  <Badge
                    className={`px-3 py-1 text-xs font-bold rounded-xl ${getStatusBadgeStyle(task.status)}`}
                  >
                    {TASK_STATUS_LABELS[task.status as TaskStatus] ||
                      task.status}
                  </Badge>
                  {task.epic?.epic_id && (
                    <span className="flex items-center gap-1 rounded-full bg-surface-highest px-3 py-1 text-xs font-bold text-slate-dark">
                      <EpicIdIcon className="w-3 h-3" />
                      {task.epic.epic_id}
                    </span>
                  )}
                </div>

             
                <div className="mb-6 grid grid-cols-2 gap-3">
                  
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
                      Assignee
                    </p>
                    <UserAvatar
                      name={task.assignee?.name}
                      jobTitle={task.assignee?.department}
                      size="sm"
                      showName={true}
                    />
                  </div>

           
                  <div className="rounded-xl bg-white p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
                      Due Date
                    </p>
                    <p className="text-sm font-medium text-slate-dark">
                      {task.due_date ? formatDate(task.due_date) : '—'}
                    </p>
                  </div>

               
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
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-medium">
                    Description
                  </p>
                  <div className="rounded-xl bg-white p-4">
                    {task.description ? (
                      <p className="text-sm leading-relaxed text-slate-dark whitespace-pre-wrap">
                        {task.description}
                      </p>
                    ) : (
                      <p className="text-sm text-slate-medium italic">
                        No description provided
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
