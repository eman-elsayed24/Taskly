import { useState } from 'react';
import toast from 'react-hot-toast';
import StatisticsFilters, {
  type StatisticsFiltersData,
} from '../../components/dashboard/statistics/StatisticsFilters';
import KPICard from '../../components/dashboard/statistics/KPICard';
import WeeklyCalendar from '../../components/dashboard/statistics/WeeklyCalendar';
import StatusDoughnutChart from '../../components/dashboard/statistics/StatusDoughnutChart';
import ProjectsList from '../../components/dashboard/statistics/ProjectsList';
import StatisticsSkeleton from '../../components/dashboard/statistics/StatisticsSkeleton';
import ErrorState from '../../components/ui/ErrorState';
import {
  useCalendarStats,
  useTasksPerProject,
} from '../../hooks/queries/useStatistics';
import { useProjects } from '../../hooks/queries/useProjects';
import { formatDateForAPI, getCurrentWeekRange } from '../../utils/dateUtils';
import TotalTasksIcon from '../../assets/icons/totalTasks.svg?react';
import CheckCircleIcon from '../../assets/icons/checkCircle.svg?react';
import OverdueTasksIcon from '../../assets/icons/overdueTasks.svg?react';

export default function MyStatistics() {
  const currentWeek = getCurrentWeekRange();
  const defaultStartDate = formatDateForAPI(currentWeek.start);
  const defaultEndDate = formatDateForAPI(currentWeek.end);

  const [filters, setFilters] = useState<StatisticsFiltersData>({
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    projectId: '',
    status: '',
  });

  const { data: projectsResponse } = useProjects(1000, 0);
  const projects = projectsResponse?.data || [];

  const {
    data: calendarData,
    isLoading: isLoadingCalendar,
    isError: isCalendarError,
    error: calendarError,
    refetch: refetchCalendar,
  } = useCalendarStats({
    p_start_date: filters.startDate,
    p_end_date: filters.endDate,
    p_project_id: filters.projectId || null,
    p_status: filters.status || null,
  });

  const {
    data: projectsData,
    isLoading: isLoadingProjects,
    isError: isProjectsError,
    error: projectsError,
    refetch: refetchProjects,
  } = useTasksPerProject({
    p_start_date: filters.startDate,
    p_end_date: filters.endDate,
  });

  const handleFilterChange = (newFilters: StatisticsFiltersData) => {
    setFilters(newFilters);
  };

  const handleRetry = () => {
    refetchCalendar();
    refetchProjects();
  };

  const isLoading = isLoadingCalendar || isLoadingProjects;
  const isError = isCalendarError || isProjectsError;

  if (calendarError) {
    toast.error(
      calendarError instanceof Error
        ? calendarError.message
        : 'Failed to load calendar stats'
    );
  }
  if (projectsError) {
    toast.error(
      projectsError instanceof Error
        ? projectsError.message
        : 'Failed to load project stats'
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <div className="mb-8">
          <h1 className="text-heading-xl text-slate-dark mb-1">
            My Statistics
          </h1>
          <p className="text-body-md text-slate-medium">
            Manage your deadlines and track team velocity.
          </p>
        </div>
        <StatisticsSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full">
        <div className="mb-8">
          <h1 className="text-heading-xl text-slate-dark mb-1">
            My Statistics
          </h1>
          <p className="text-body-md text-slate-medium">
            Manage your deadlines and track team velocity.
          </p>
        </div>
        <div className="flex items-center justify-center py-16">
          <ErrorState onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  const daily = calendarData?.daily || [];
  const totals = calendarData?.totals || {};
  const totalTasks = calendarData?.total_tasks || 0;
  const doneTasks = calendarData?.done_tasks || 0;
  const overdueTasks = calendarData?.overdue_tasks || 0;
  const projectsList = projectsData || [];

  return (
    <div className="w-full h-full">
      <div className="mb-8">
        <h1 className="text-heading-xl text-slate-dark mb-1">My Statistics</h1>
        <p className="text-body-md text-slate-medium">
          Manage your deadlines and track team velocity.
        </p>
      </div>

      <div className="space-y-6">
        <StatisticsFilters
          onFilterChange={handleFilterChange}
          projects={projects}
          defaultStartDate={defaultStartDate}
          defaultEndDate={defaultEndDate}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Total Tasks"
            value={totalTasks}
            icon={<TotalTasksIcon className="w-6 h-6 text-primary" />}
            colorClass="text-primary"
            bgColorClass="bg-primary-lighter"
          />
          <KPICard
            title="Completed Tasks"
            value={doneTasks}
            icon={<CheckCircleIcon className="w-6 h-6 text-success" />}
            colorClass="text-success"
            bgColorClass="bg-success-lighter"
          />
          <KPICard
            title="Overdue Tasks"
            value={overdueTasks}
            icon={<OverdueTasksIcon className="w-6 h-6 text-error" />}
            colorClass="text-error"
            bgColorClass="bg-error-lighter"
          />
        </div>

        <WeeklyCalendar dailyStats={daily} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatusDoughnutChart totals={totals} totalTasks={totalTasks} />
          <ProjectsList projects={projectsList} />
        </div>
      </div>
    </div>
  );
}
