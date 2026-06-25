import { TaskStatus } from '../types/task';


export const TASK_STATUS_BADGE_STYLES: Record<TaskStatus, string> = {
  [TaskStatus.TO_DO]: 'bg-slate-lighter text-slate-text',
  [TaskStatus.IN_PROGRESS]: 'bg-blue-lighter text-blue-text',
  [TaskStatus.BLOCKED]: 'bg-error-lighter text-error-dark',
  [TaskStatus.IN_REVIEW]: 'bg-yellow-100 text-yellow-700',
  [TaskStatus.REOPENED]: 'bg-orange-100 text-orange-700',
  [TaskStatus.READY_FOR_QA]: 'bg-purple-100 text-purple-700',
  [TaskStatus.READY_FOR_PRODUCTION]: 'bg-teal-100 text-teal-700',
  [TaskStatus.DONE]: 'bg-success-light text-success-darker',
};

// Dot colors for board column headers
export const TASK_STATUS_DOT_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.TO_DO]: 'bg-slate-dark',
  [TaskStatus.IN_PROGRESS]: 'bg-primary-container',
  [TaskStatus.BLOCKED]: 'bg-error',
  [TaskStatus.IN_REVIEW]: 'bg-slate-dark',
  [TaskStatus.REOPENED]: 'bg-surface-dark',
  [TaskStatus.READY_FOR_QA]: 'bg-slate-medium',
  [TaskStatus.READY_FOR_PRODUCTION]: 'bg-warning',
  [TaskStatus.DONE]: 'bg-success',
};


export function getStatusBadgeStyle(status: TaskStatus | string): string {
  return (
    TASK_STATUS_BADGE_STYLES[status as TaskStatus] ||
    'bg-slate-light/30 text-slate-dark'
  );
}


export function getStatusDotColor(status: TaskStatus | string): string {
  return TASK_STATUS_DOT_COLORS[status as TaskStatus] || 'bg-slate-400';
}
