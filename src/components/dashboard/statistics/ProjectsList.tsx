import type { ProjectTaskCount } from '../../../types/statistics';

interface ProjectsListProps {
  projects: ProjectTaskCount[];
}

export default function ProjectsList({ projects }: ProjectsListProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-border-light">
      <h3 className="text-heading-md text-slate-dark mb-6">All Projects</h3>

      {projects.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-body-md text-slate-medium">
            No projects in this period
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => (
            <div
              key={project.project_id}
              className="flex items-center justify-between p-4 rounded-lg border border-border-light hover:border-primary/30 transition-colors"
            >
              <span className="text-body-md text-slate-dark font-medium">
                {project.project_name}
              </span>
              <span className="text-body-lg font-bold text-primary">
                {project.tasks_count} Tasks
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
