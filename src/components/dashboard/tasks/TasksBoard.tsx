import TaskBoardColumn from './TaskBoardColumn';
import { TaskStatus } from '../../../types/task';

const TasksBoard: React.FC = () => {
  const statusList = Object.values(TaskStatus);

  return (
    <section className="flex gap-6 w-full overflow-x-auto pb-4">
      {statusList.map(status => (
        <TaskBoardColumn key={status} status={status} />
      ))}
    </section>
  );
};

export default TasksBoard;
