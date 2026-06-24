import { useState } from 'react';
import TaskViewSelect from './TaskViewSelect';
import Breadcrumb from '../../ui/Breadcrumb';
import SearchIcon from '../../../assets/icons/search.svg?react';
import FilterIcon from '../../../assets/icons/filter.svg?react';
import { ROUTES } from '../../../constants/routes';

interface TasksHeaderProps {
  view: string;
  onViewChange: (view: string) => void;
  projectId?: string;
  projectName?: string;
}

export default function TasksHeader({
  view,
  onViewChange,
  projectId,
  projectName,
}: TasksHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'PROJECTS', href: ROUTES.PROJECTS },
          {
            label: projectName || 'PROJECT',
            href: projectId ? ROUTES.PROJECT_DETAILS(projectId) : undefined,
          },
          { label: 'TASKS' },
        ]}
      />

      {/* Desktop Header */}
      <header className="hidden lg:flex justify-between items-end ">
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

          {/* View Selector - Desktop only */}
          <div className="hidden xl:block">
            <TaskViewSelect value={view} onChange={onViewChange} />
          </div>

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
      <header className="flex flex-col lg:hidden gap-4 mt-6">
        <h1 className="text-heading-md font-semibold text-slate-dark">
          Active Workboard
        </h1>

        {/* Search Input only - No filter */}
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
      </header>
    </>
  );
}
