import { useParams, useSearchParams, Link } from 'react-router-dom';
import TasksBoard from '../../components/dashboard/tasks/TasksBoard';
import TasksList from '../../components/dashboard/tasks/TasksList';
import TasksHeader from '../../components/dashboard/tasks/TasksHeader';
import TaskDetailsModal from '../../components/dashboard/tasks/TaskDetailsModal';
import Button from '../../components/ui/button';
import { ROUTES } from '../../constants/routes';
import { useAppSelector } from '../../redux/hooks';

export default function ProjectTasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedTaskId = useAppSelector(
    state => state.taskModal.selectedTaskId
  );

  const view = searchParams.get('view') || 'board';

  const handleViewChange = (newView: string) => {
    setSearchParams({ view: newView });
  };

  return (
    <div className="flex flex-col gap-5 ">
      <TasksHeader view={view} onViewChange={handleViewChange} />

      <div className="lg:hidden">
        <Link
          to={projectId ? ROUTES.ADD_TASK(projectId) : '#'}
          className="block"
        >
          <Button variant="primary" className="w-full">
            + Create Task
          </Button>
        </Link>
      </div>

      <div className="hidden lg:block relative">
        {view === 'board' && <TasksBoard />}
        {view === 'list' && <TasksList />}

        {view === 'list' && (
          <Link
            to={projectId ? ROUTES.ADD_TASK(projectId) : '#'}
            className="fixed bottom-8 right-8 z-50"
          >
            <button className="bg-primary w-14 h-14 text-white rounded-md flex items-center justify-center shadow-lg hover:bg-primary-container transition-colors">
              <span className="text-2xl leading-none">+</span>
            </button>
          </Link>
        )}
      </div>

      {/* Mobile: show List view only */}
      <div className="block lg:hidden">
        <TasksList />
      </div>

      {selectedTaskId && <TaskDetailsModal />}
    </div>
  );
}
