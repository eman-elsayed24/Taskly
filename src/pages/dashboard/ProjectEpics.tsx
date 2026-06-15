import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../../components/ui/button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ErrorState from '../../components/ui/ErrorState';
import EpicCard from '../../components/dashboard/epics/EpicCard';
import EpicCardSkeleton from '../../components/dashboard/epics/EpicCardSkeleton';
import { getProjectEpics } from '../../api/epicApi';
import { getProjectById } from '../../api/projectApi';
import type { Epic } from '../../types/epic';
import type { Project } from '../../types/project';
import { ROUTES } from '../../constants/routes';
import EmptyIcon from '../../assets/icons/empty.svg';
import PlusCircleIcon from '../../assets/icons/plusCircle.svg?react';
import LightbulbIcon from '../../assets/icons/lightbulb.svg?react';
import HubIcon from '../../assets/icons/hub.svg?react';
import MonitoringIcon from '../../assets/icons/monitoring.svg?react';

export default function ProjectEpics() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [epics, setEpics] = useState<Epic[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!projectId) return;

    let isMounted = true;

    const loadData = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const [projectData, epicsData] = await Promise.all([
          getProjectById(projectId),
          getProjectEpics(projectId),
        ]);

        if (isMounted) {
          setProject(projectData);
          setEpics(epicsData);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setHasError(true);
          setIsLoading(false);
          toast.error(
            error instanceof Error ? error.message : 'Failed to load epics'
          );
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const handleRetry = () => {
    if (!projectId) return;

    setIsLoading(true);
    setHasError(false);

    Promise.all([getProjectById(projectId), getProjectEpics(projectId)])
      .then(([projectData, epicsData]) => {
        setProject(projectData);
        setEpics(epicsData);
        setIsLoading(false);
      })
      .catch(error => {
        setHasError(true);
        setIsLoading(false);
        toast.error(
          error instanceof Error ? error.message : 'Failed to load epics'
        );
      });
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col">
        <div className="mb-8">
          <div className="h-6 w-64 bg-surface-highest rounded mb-4 animate-pulse" />
          <div className="h-10 w-48 bg-surface-highest rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <EpicCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <ErrorState
          title="Failed to Load Epics"
          message="Failed to load project epics. Please try again."
          onRetry={handleRetry}
        />
      </div>
    );
  }

  // Empty State
  if (!isLoading && epics.length === 0) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'PROJECTS', href: ROUTES.PROJECTS },
            {
              label: project?.name || 'PROJECT',
              href: projectId ? ROUTES.PROJECT_DETAILS(projectId) : undefined,
            },
            { label: 'EPICS' },
          ]}
        />

        <div className="flex flex-col gap-8 items-center mx-auto my-20">
          <img
            src={EmptyIcon}
            alt="No epics"
            className="w-64 h-64 shadow-xl rounded-lg"
          />
          <h1 className="text-headline-lg text-slate-dark">
            No epics in this project yet.
          </h1>
          <p className="text-body-md text-slate-medium text-center font-semibold max-w-md">
            Break down your large project into manageable epics to track
            progress better and maintain architectural clarity.
          </p>
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => {
              if (projectId) {
                navigate(ROUTES.ADD_EPIC(projectId));
              }
            }}
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Create First Epic</span>
          </Button>

          {/* Feature Cards */}
          <section className="flex flex-col sm:flex-row items-stretch gap-6 mt-10">
            <div className="w-full sm:w-72 p-6 bg-surface-low space-y-2 rounded-md">
              <div className="bg-white p-2 w-9 h-9 rounded flex items-center justify-center">
                <LightbulbIcon className="w-5 h-5" />
              </div>
              <h5 className="text-slate-dark text-title-md">
                High-Level Goals
              </h5>
              <p className="text-slate-medium text-body-md">
                Define the broad objectives that span across multiple cycles.
              </p>
            </div>
            <div className="w-full sm:w-72 p-6 bg-surface-low space-y-2 rounded-md">
              <div className="bg-white p-2 w-9 h-9 rounded flex items-center justify-center">
                <HubIcon className="w-5 h-5" />
              </div>
              <h5 className="text-slate-dark text-title-md">
                Hierarchy Design
              </h5>
              <p className="text-slate-medium text-body-md">
                Link individual tasks to parent epics for a consolidated view.
              </p>
            </div>
            <div className="w-full sm:w-72 p-6 bg-surface-low space-y-2 rounded-md">
              <div className="bg-white p-2 w-9 h-9 rounded flex items-center justify-center">
                <MonitoringIcon className="w-5 h-5" />
              </div>
              <h5 className="text-slate-dark text-title-md">Track Velocity</h5>
              <p className="text-slate-medium text-body-md">
                Visualize percentage completion at a macro project level.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Epics List
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section */}
      <div className="mb-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'PROJECTS', href: ROUTES.PROJECTS },
            {
              label: project?.name || 'PROJECT',
              href: projectId ? ROUTES.PROJECT_DETAILS(projectId) : undefined,
            },
            { label: 'EPICS' },
          ]}
        />

        {/* Title and Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-heading-xl text-slate-dark">Project Epics</h1>
          <Button
            variant="primary"
            className="flex items-center gap-2 w-full sm:w-auto"
            onClick={() => {
              if (projectId) {
                navigate(ROUTES.ADD_EPIC(projectId));
              }
            }}
          >
            <span className="text-xl leading-none">+</span>
            New Epic
          </Button>
        </div>
      </div>

      {/* Epics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {epics.map(epic => (
          <EpicCard key={epic.id} epic={epic} />
        ))}
      </div>

      {/* Footer: Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto pt-6">
        <p className="text-body-sm text-slate-medium">
          Showing {epics.length} of {epics.length} epics
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
