import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import type { Project } from '../../../types/project';
import { formatDate } from '../../../utils/formatDate';
import EventIcon from '../../../assets/icons/event.svg';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(ROUTES.PROJECT_EPICS(project.id));
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(ROUTES.PROJECT_DETAILS(project.id));
  };

  return (
    <div
      onClick={handleCardClick}
      className="cursor-pointer flex flex-col gap-6 md:gap-6 min-h-[212px] md:min-h-[220px] bg-white p-4 pb-6 md:p-6 justify-between rounded-md hover:shadow-sm transition-shadow"
    >
      <div className="flex flex-col gap-6 md:gap-2">
        <div className="flex justify-between items-start gap-2">
          <p className="font-semibold text-lg leading-[24.75px] md:leading-7 md:font-medium text-slate-dark">
            {project.name}
          </p>
          <button
            onClick={handleEditClick}
            className="shrink-0 p-1.5 hover:bg-surface-high rounded transition-colors text-base"
            aria-label="Edit project"
          >
            ✏️
          </button>
        </div>
        <p className="text-sm leading-[22.75px] text-slate-medium line-clamp-3">
          {project.description || 'No description provided'}
        </p>
      </div>
      <div className="flex justify-between items-center gap-1 border-t border-slate-light/10 pt-4 md:pt-6">
        <p className="hidden md:block uppercase font-bold text-[11px] leading-[16.5px] tracking-tight text-slate-light">
          CREATED AT
        </p>
        <div className="flex items-center gap-1">
          <img src={EventIcon} alt="" className="md:hidden w-4 h-4" />
          <div className="text-xs md:text-sm leading-4 md:leading-5 font-medium text-slate-medium">
            {formatDate(project.created_at)}
          </div>
        </div>
      </div>
    </div>
  );
}
