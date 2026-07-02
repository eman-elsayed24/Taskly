import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { TASK_STATUS_LABELS } from '../../../types/task';
import { formatDateForAPI } from '../../../utils/dateUtils';
import type { Project } from '../../../types/project';
import DateRangePicker from './DateRangePicker';

export interface StatisticsFiltersData {
  startDate: string;
  endDate: string;
  projectId: string;
  status: string;
}

interface StatisticsFiltersProps {
  onFilterChange: (filters: StatisticsFiltersData) => void;
  projects: Project[];
  defaultStartDate: string;
  defaultEndDate: string;
}

export default function StatisticsFilters({
  onFilterChange,
  projects,
  defaultStartDate,
  defaultEndDate,
}: StatisticsFiltersProps) {
  const [startDate, setStartDate] = useState(new Date(defaultStartDate));
  const [endDate, setEndDate] = useState(new Date(defaultEndDate));

  const { register, watch } = useForm<StatisticsFiltersData>({
    defaultValues: {
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      projectId: '',
      status: '',
    },
  });

  const projectId = watch('projectId');
  const status = watch('status');

  const handleDateRangeApply = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    const filters: StatisticsFiltersData = {
      startDate: formatDateForAPI(startDate),
      endDate: formatDateForAPI(endDate),
      projectId,
      status,
    };
    onFilterChange(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate, projectId, status]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onApply={handleDateRangeApply}
        />

        <div className="flex items-center gap-3">
          <select
            {...register('projectId')}
            className="px-4 py-2 rounded-sm text-body-sm outline-none bg-surface-highest text-slate-dark cursor-pointer border border-border-light"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            {...register('status')}
            className="px-4 py-2 rounded-sm text-body-sm outline-none bg-surface-highest text-slate-dark cursor-pointer border border-border-light"
          >
            <option value="">All Statuses</option>
            {Object.entries(TASK_STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
