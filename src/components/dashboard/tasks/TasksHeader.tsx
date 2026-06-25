import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '../../../hooks/useProject';
import Breadcrumb from '../../ui/Breadcrumb';
import SearchInput from '../../ui/SearchInput';
import TaskViewSelect from './TaskViewSelect';
import { ROUTES } from '../../../constants/routes';
import FilterIcon from '../../../assets/icons/filter.svg?react';

interface TasksHeaderProps {
  view: string;
  onViewChange: (view: string) => void;
}

export default function TasksHeader({ view, onViewChange }: TasksHeaderProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const { project } = useProject(projectId);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
   
      <Breadcrumb
        items={[
          { label: 'PROJECTS', href: ROUTES.PROJECTS },
          {
            label: project?.name || 'PROJECT',
            href: projectId ? ROUTES.PROJECT_DETAILS(projectId) : undefined,
          },
          { label: 'TASKS' },
        ]}
      />

      {/* Desktop Header */}
      <header className="hidden lg:flex justify-between items-end ">
        <div className="flex flex-col gap-1">
          <h1 className="text-heading-xl font-semibold text-slate-dark">
            Active Workboard
          </h1>
          <p className="text-body text-slate-medium leading-5">
            Curating Project Alpha's production pipeline and milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
         
          <SearchInput
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-64 hidden sm:block"
          />

   
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
      </header>
    </>
  );
}
