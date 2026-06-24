import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useProject } from '../../hooks/useProject';
import TasksBoard from '../../components/dashboard/tasks/TasksBoard';
import TasksList from '../../components/dashboard/tasks/TasksList';
import TasksHeader from '../../components/dashboard/tasks/TasksHeader';
import Button from '../../components/ui/button';
import { ROUTES } from '../../constants/routes';

export default function ProjectTasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { project } = useProject(projectId);

  const view = searchParams.get('view') || 'board';

  const handleViewChange = (newView: string) => {
    setSearchParams({ view: newView });
  };

  return (
    <div className="flex flex-col gap-5">
      <TasksHeader
        view={view}
        onViewChange={handleViewChange}
        projectId={projectId}
        projectName={project?.name}
      />

      {/* Mobile: Create Task Button */}
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

      {/* Desktop: Show selected view (Board or List) */}
      <div className="hidden lg:block relative">
        {view === 'board' && <TasksBoard />}
        {view === 'list' && <TasksList />}

        {/* Desktop: Floating Create Task Button - Only in List View */}
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

      {/* Mobile: Always show List view only */}
      <div className="block lg:hidden">
        <TasksList />
      </div>
    </div>
  );
}
