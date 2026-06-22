import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import TasksBoard from '../../components/dashboard/tasks/TasksBoard';
import TasksList from '../../components/dashboard/tasks/TasksList';
import TaskViewSelect from '../../components/dashboard/tasks/TaskViewSelect';
import SearchIcon from '../../assets/icons/search.svg?react';
import FilterIcon from '../../assets/icons/filter.svg?react';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { ROUTES } from '../../constants/routes';

export default function ProjectTasks() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const view = searchParams.get('view') || 'board';

  const handleViewChange = (newView: string) => {
    setSearchParams({ view: newView });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'PROJECTS', href: ROUTES.PROJECTS },
          {
            label: 'PROJECT ALPHA',
            href: projectId ? ROUTES.PROJECT_DETAILS(projectId) : undefined,
          },
          { label: 'TASKS' },
        ]}
      />

      {/* Desktop Header */}
      <header className="hidden lg:flex justify-between items-end">
        {/* Left: Title & Description */}
        <div className="flex flex-col gap-1">
          <h1 className="text-heading-xl font-semibold text-slate-dark">
            Active Workboard
          </h1>
          <p className="text-body text-slate-medium leading-5">
            Curating Project Alpha's production pipeline and milestones.
          </p>
        </div>

        {/* Right: Search, View Selector, Filter */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative w-72">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-medium" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-primary-light rounded-lg text-body text-slate-dark placeholder:text-slate-medium focus:outline-none focus:ring-2 focus:ring-primary/20 border-none"
            />
          </div>

          {/* View Selector */}
          <TaskViewSelect value={view} onChange={handleViewChange} />

          {/* Filter Button */}
          <button
            className="p-2.5 bg-white border border-slate-light/20 rounded-lg hover:bg-surface-low transition-colors shadow-sm"
            title="Filter tasks"
          >
            <FilterIcon className="w-5 h-5 text-slate-dark" />
          </button>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="flex flex-col lg:hidden gap-4">
        <h1 className="text-heading-md font-semibold text-slate-dark">
          Active Workboard
        </h1>

        <div className="flex flex-col gap-3">
          {/* Search Input */}
          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-medium" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-primary-light rounded-lg text-body text-slate-dark placeholder:text-slate-medium focus:outline-none focus:ring-2 focus:ring-primary/20 border-none"
            />
          </div>

          {/* View Selector & Filter */}
          <div className="flex items-center gap-3">
            {/* View Selector */}
            <div className="flex-1">
              <TaskViewSelect value={view} onChange={handleViewChange} />
            </div>

            {/* Filter Button */}
            <button
              className="p-2.5 bg-white border border-slate-light/20 rounded-lg hover:bg-surface-low transition-colors shadow-sm"
              title="Filter tasks"
            >
              <FilterIcon className="w-5 h-5 text-slate-dark" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      {view === 'board' && <TasksBoard />}
      {view === 'list' && <TasksList />}
    </div>
  );
}
