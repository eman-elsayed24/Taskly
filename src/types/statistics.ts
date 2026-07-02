export interface CalendarStatsRequest {
  p_start_date: string;
  p_end_date: string;
  p_project_id?: string | null;
  p_status?: string | null;
}

export interface DayStatusCount {
  [status: string]: number;
}

export interface DailyStats {
  day: string;
  statuses: DayStatusCount;
}

export interface StatusTotals {
  [status: string]: number;
}

export interface CalendarStatsResponse {
  daily: DailyStats[];
  totals: StatusTotals;
  total_tasks: number;
  done_tasks: number;
  overdue_tasks: number;
}

export interface TasksPerProjectRequest {
  p_start_date: string;
  p_end_date: string;
}

export interface ProjectTaskCount {
  project_id: string;
  project_name: string;
  tasks_count: number;
}

export type TasksPerProjectResponse = ProjectTaskCount[];
