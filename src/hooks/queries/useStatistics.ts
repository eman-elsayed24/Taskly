import { useQuery } from '@tanstack/react-query';
import { getCalendarStats, getTasksPerProject } from '../../api/statisticsApi';
import type {
  CalendarStatsRequest,
  TasksPerProjectRequest,
} from '../../types/statistics';

export const statisticsKeys = {
  all: ['statistics'] as const,
  calendar: (params: CalendarStatsRequest) =>
    [...statisticsKeys.all, 'calendar', params] as const,
  projects: (params: TasksPerProjectRequest) =>
    [...statisticsKeys.all, 'projects', params] as const,
};

export function useCalendarStats(params: CalendarStatsRequest) {
  return useQuery({
    queryKey: statisticsKeys.calendar(params),
    queryFn: () => getCalendarStats(params),
    enabled: !!params.p_start_date && !!params.p_end_date,
  });
}

export function useTasksPerProject(params: TasksPerProjectRequest) {
  return useQuery({
    queryKey: statisticsKeys.projects(params),
    queryFn: () => getTasksPerProject(params),
    enabled: !!params.p_start_date && !!params.p_end_date,
  });
}
