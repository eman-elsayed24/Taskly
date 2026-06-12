import { useParams } from 'react-router-dom';

export default function ProjectTasks() {
  const { projectId } = useParams<{ projectId: string }>();

  return (
    <div>
      <h1 className="text-heading-md text-slate-dark mb-4">Project Tasks</h1>
      <p className="text-body-lg text-slate-medium">
        Project Tasks page content for project {projectId}
      </p>
    </div>
  );
}
