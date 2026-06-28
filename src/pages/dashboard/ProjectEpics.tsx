import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProject } from '../../hooks/useProject';
import { useDebounce } from '../../hooks/useDebounce';
import { useProjectEpics } from '../../hooks/queries/useEpics';
import Button from '../../components/ui/button';
import Breadcrumb from '../../components/ui/Breadcrumb';
import SearchInput from '../../components/ui/SearchInput';
import ErrorState from '../../components/ui/ErrorState';
import Pagination from '../../components/ui/Pagination';
import InfiniteScrollLoader from '../../components/ui/InfiniteScrollLoader';
import EpicCard from '../../components/dashboard/epics/EpicCard';
import EpicCardSkeleton from '../../components/dashboard/epics/EpicCardSkeleton';
import EpicDetailsModal from '../../components/dashboard/epics/EpicDetailsModal';
import TaskDetailsModal from '../../components/dashboard/tasks/details/TaskDetailsModal';
import { getProjectEpics } from '../../api/epicApi';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { useAppSelector } from '../../redux/hooks';
import type { Epic } from '../../types/epic';
import { ROUTES } from '../../constants/routes';
import EmptyEpicsIcon from '../../assets/icons/emptyEpics.svg';
import RocketIcon from '../../assets/icons/rocket.svg?react';
import GoalsIcon from '../../assets/icons/goals.svg?react';
import HubIcon from '../../assets/icons/hub.svg?react';
import TrackVelocityIcon from '../../assets/icons/track Velocity.svg?react';

export default function ProjectEpics() {
  const { projectId } = useParams<{ projectId: string }>();
  const { project } = useProject(projectId);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEpic, setSelectedEpic] = useState<Epic | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const selectedTaskId = useAppSelector(
    state => state.taskModal.selectedTaskId
  );
  const pageSize = 10;

  // Debounce the search query with 400ms delay
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const offset = (currentPage - 1) * pageSize;

  // React Query - fetch epics
  const {
    data: epicsResponse,
    isLoading,
    isError,
    refetch,
  } = useProjectEpics(projectId || '', pageSize, offset, debouncedSearchQuery);

  const initialEpics = epicsResponse?.data || [];
  const totalCount = epicsResponse?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Infinite scroll hook for mobile
  const {
    items: displayedEpics,
    loading: isLoadingMore,
    hasMore,
    observerTarget,
  } = useInfiniteScroll({
    initialItems: initialEpics,
    totalCount: totalCount,
    pageSize,
    fetchMore: async (offset, limit) => {
      if (!projectId) throw new Error('No project ID');
      const response = await getProjectEpics(
        projectId,
        limit,
        offset,
        debouncedSearchQuery
      );
      return { data: response.data, totalCount: response.totalCount };
    },
  });

  const handleRetry = () => {
    refetch();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleEpicClick = (epic: Epic) => {
    setSelectedEpic(epic);
  };

  const handleCloseModal = () => {
    setSelectedEpic(null);
  };

  const handleEpicUpdate = (updatedEpic: Epic) => {
    // Refetch epics to get the latest data
    refetch();
    // Update selected epic to reflect changes
    setSelectedEpic(updatedEpic);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col">
        {/* Breadcrumb - Desktop Only */}
        <div className="mb-4 hidden sm:block">
          <div className="h-6 w-64 bg-surface-highest rounded mb-4 animate-pulse" />
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="h-10 w-48 bg-surface-highest rounded animate-pulse" />
        </div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <EpicCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
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
  if (!isLoading && displayedEpics.length === 0) {
    // Show full empty state for projects with no epics (and no active search)
    if (!debouncedSearchQuery.trim()) {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex flex-col gap-8 items-center mx-auto my-20">
            <img src={EmptyEpicsIcon} alt="No epics" className="w-64 h-64" />
            <h1 className="text-headline-lg text-slate-dark">
              No epics in this project yet.
            </h1>
            <p className="text-body-md text-slate-medium text-center font-semibold max-w-md">
              Break down your large project into manageable epics to track
              progress better and maintain architectural clarity.
            </p>
            <Link
              to={projectId ? ROUTES.ADD_EPIC(projectId) : '#'}
              className="inline-block"
            >
              <Button variant="primary" className="flex items-center gap-2">
                <RocketIcon className="w-5 h-5" />
                <span>Create First Epic</span>
              </Button>
            </Link>

            {/* Feature Cards */}
            <section className="flex flex-col sm:flex-row items-stretch gap-6 mt-10">
              <div className="w-full sm:w-72 p-6 bg-surface-low space-y-3 rounded-md">
                <div className="bg-white p-2.5 w-10 h-10 rounded flex items-center justify-center">
                  <GoalsIcon className="w-5 h-5 text-primary" />
                </div>
                <h5 className="text-slate-dark text-title-md">
                  High-Level Goals
                </h5>
                <p className="text-slate-medium text-body-md">
                  Define the broad objectives that span across multiple cycles.
                </p>
              </div>
              <div className="w-full sm:w-72 p-6 bg-surface-low space-y-3 rounded-md">
                <div className="bg-white p-2.5 w-10 h-10 rounded flex items-center justify-center">
                  <HubIcon className="w-5 h-5 text-primary" />
                </div>
                <h5 className="text-slate-dark text-title-md">
                  Hierarchy Design
                </h5>
                <p className="text-slate-medium text-body-md">
                  Link individual tasks to parent epics for a consolidated view.
                </p>
              </div>
              <div className="w-full sm:w-72 p-6 bg-surface-low space-y-3 rounded-md">
                <div className="bg-white p-2.5 w-10 h-10 rounded flex items-center justify-center">
                  <TrackVelocityIcon className="w-5 h-5 text-primary" />
                </div>
                <h5 className="text-slate-dark text-title-md">
                  Track Velocity
                </h5>
                <p className="text-slate-medium text-body-md">
                  Visualize percentage completion at a macro project level.
                </p>
              </div>
            </section>
          </div>
        </div>
      );
    }
  }

  // Epics List
  return (
    <div className="w-full h-full flex flex-col">
      {/* Header Section - Always Visible */}
      <div className="mb-8">
        {/* Breadcrumb - Desktop Only */}
        <div className="hidden sm:block">
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
        </div>

        {/* Title, Search and Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-heading-xl text-slate-dark">Project Epics</h1>

          <div className="flex items-center gap-3">
            {/* Search Input - Visible on Both Mobile and Desktop */}
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search epics..."
              className="flex-1 sm:w-64"
            />

            {/* New Epic Button - Desktop Only */}
            <Link
              to={projectId ? ROUTES.ADD_EPIC(projectId) : '#'}
              className="hidden sm:inline-block"
            >
              <Button
                variant="primary"
                className="flex items-center gap-2 whitespace-nowrap"
              >
                <span className="text-xl leading-none">+</span>
                New Epic
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {!isLoading &&
      displayedEpics.length === 0 &&
      debouncedSearchQuery.trim() ? (
        // No Search Results
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-surface-low rounded-full p-6 mb-4">
            <RocketIcon className="w-16 h-16 text-slate-medium" />
          </div>
          <h2 className="text-headline-lg text-slate-dark mb-2">
            No epics found
          </h2>
          <p className="text-body-md text-slate-medium text-center max-w-md">
            No epics found matching "{debouncedSearchQuery}". Try a different
            search term.
          </p>
        </div>
      ) : (
        <>
          {/* Epics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {displayedEpics.map(epic => (
              <EpicCard
                key={epic.id}
                epic={epic}
                onClick={() => handleEpicClick(epic)}
              />
            ))}
          </div>

          {/* Infinite Scroll Loader for Mobile */}
          <InfiniteScrollLoader
            loading={isLoadingMore}
            hasMore={hasMore}
            observerTarget={observerTarget}
          />

          {/* Desktop Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            pageSize={pageSize}
            itemLabel="epics"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Epic Details Modal */}
      {selectedEpic && (
        <EpicDetailsModal
          epic={selectedEpic}
          projectId={projectId!}
          onClose={handleCloseModal}
          onUpdate={handleEpicUpdate}
        />
      )}

      {selectedTaskId && <TaskDetailsModal />}

      {/* Floating Add Button - Mobile Only */}
      <Link
        to={projectId ? ROUTES.ADD_EPIC(projectId) : '#'}
        className="fixed sm:hidden bottom-8 right-5 z-50"
      >
        <button className="bg-primary w-14 h-14 text-white rounded-md flex items-center justify-center shadow-lg hover:bg-primary-container transition-colors">
          <span className="text-2xl leading-none">+</span>
        </button>
      </Link>
    </div>
  );
}
