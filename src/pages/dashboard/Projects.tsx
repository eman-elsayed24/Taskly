import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/ui/button';

import ProjectCard from '../../components/dashboard/projects/ProjectCard';
import ProjectCardSkeleton from '../../components/dashboard/projects/ProjectCardSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import { ROUTES } from '../../constants/routes';
import { getProjects } from '../../api/projectApi';
import type { Project } from '../../types/project';
import EmptyIcon from '../../assets/icons/empty.svg';
import PlusCircleIcon from '../../assets/icons/plusCircle.svg?react';

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProjects = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const data = await getProjects();
        if (isMounted) {
          setProjects(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
          toast.error(
            error instanceof Error ? error.message : 'Failed to load projects'
          );
        }
      }
    };

    loadProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);

    getProjects()
      .then(data => {
        setProjects(data);
        setIsLoading(false);
      })
      .catch(error => {
        setHasError(true);
        setIsLoading(false);
        toast.error(
          error instanceof Error ? error.message : 'Failed to load projects'
        );
      });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorState onRetry={handleRetry} />
      </div>
    );
  }

  if (!isLoading && projects.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-heading-xl text-slate-dark mb-1">Projects</h1>
            <p className="text-body-md text-slate-medium">
              Manage and curate your projects
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <img src={EmptyIcon} alt="" className="w-64 h-64 mb-8" />
          <h3 className="text-4xl font-semibold text-slate-dark mb-3 tracking-tight">
            No Projects
          </h3>
          <p className="text-lg text-slate-medium text-center max-w-[434px] mb-8 leading-7">
            You don't have any projects yet. Start by defining your first
            architectural workspace to begin tracking tasks and epics.
          </p>
          <Button
            variant="primary"
            onClick={() => navigate(ROUTES.ADD_PROJECT)}
            className="flex items-center gap-2"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Create New Project
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-heading-xl text-slate-dark mb-1">Projects</h1>
          <p className="text-body-md text-slate-medium">
            Manage and curate your projects
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.ADD_PROJECT)}
          className="flex items-center gap-2 w-full sm:w-auto"
        >
          <span className="text-xl leading-none">+</span>
          Create New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}

        <button
          onClick={() => navigate(ROUTES.ADD_PROJECT)}
          className="bg-white rounded-md p-6 border-2 border-dashed border-border-light hover:border-primary/30 transition-colors flex flex-col items-center justify-center min-h-[212px] md:min-h-[220px] group cursor-pointer"
        >
          <div className="w-12 h-12  bg-surface-low rounded-lg   flex items-center justify-center mb-3">
            <PlusCircleIcon className="w-5 h-5 text-slate-medium" />
          </div>
          <span className="text-sm font-medium text-slate-medium group-hover:text-primary transition-colors uppercase tracking-wide">
            ADD PROJECT
          </span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-6 ">
        <p className="text-body-sm text-slate-medium">
          Showing {projects.length} of {projects.length} active projects
        </p>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded text-slate-medium hover:bg-surface-highest transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            ‹
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-white font-medium">
            1
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded text-slate-medium hover:bg-surface-highest transition-colors">
            2
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded text-slate-medium hover:bg-surface-highest transition-colors">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
