import { useAppDispatch } from '../../../redux/hooks';
import { openTaskDetails } from '../../../redux/slices/taskModalSlice';
import Button from '../../ui/button';
import type { EpicTask } from '../../../api/taskApi';
import EpicTaskItem from './EpicTaskItem';
import TasksListIcon from '../../../assets/icons/tasksList.svg?react';
import Skeleton from '../../ui/skeleton';

interface EpicTasksListProps {
  tasks: EpicTask[];
  isLoading: boolean;
  hasError: boolean;
  onAddTask: () => void;
}

export default function EpicTasksList({
  tasks,
  isLoading,
  hasError,
  onAddTask,
}: EpicTasksListProps) {
  const dispatch = useAppDispatch();

  return (
    <section className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h4 className="text-title-md text-slate-dark capitalize">Tasks</h4>
        <Button
          variant="secondary"
          className="capitalize text-body-md"
          onClick={onAddTask}
        >
          + Add Task
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full" />
          ))}
        </div>
      ) : hasError ? (
        <div className="bg-error-low flex flex-col items-center gap-4 rounded-lg p-10">
          <p className="text-error text-body-md text-center">
            Failed to load tasks
          </p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-surface-low flex flex-col items-center gap-6 rounded-lg p-10">
          <div className="bg-surface-highest rounded-xl p-3">
            <TasksListIcon className="w-5 h-5 text-primary" />
          </div>
          <p className="text-title-md text-slate-dark text-center">
            No tasks have been added to this epic yet
          </p>
          <Button className="text-body-md" onClick={onAddTask}>
            + Add Task
          </Button>
        </div>
      ) : (
        <div className="border border-slate-light/30 rounded-sm overflow-hidden">
          {tasks.map((task, index) => (
            <EpicTaskItem
              key={task.id}
              task={task}
              isLast={index === tasks.length - 1}
              onClick={() => dispatch(openTaskDetails(task.id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}
