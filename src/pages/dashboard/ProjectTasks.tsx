import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useProject } from '../../hooks/useProject';
import TasksBoard from '../../components/dashboard/tasks/TasksBoard';
import TasksList from '../../components/dashboard/tasks/TasksList';
import TasksHeader from '../../components/dashboard/tasks/TasksHeader';

export default function ProjectTasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const { project } = useProject(projectId);

  const view = searchParams.get('view') || 'board';

  const handleViewChange = (newView: string) => {
    setSearchParams({ view: newView });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Breadcrumb */}
      <TasksHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        view={view}
        onViewChange={handleViewChange}
        projectId={projectId}
        projectName={project?.name}
      />

      {/* Content */}
      {view === 'board' && <TasksBoard />}
      {view === 'list' && <TasksList />}
    </div>
  );
}
