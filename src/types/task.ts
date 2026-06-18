export const TaskStatus = {
  TO_DO: 'TO_DO',
  IN_PROGRESS: 'IN_PROGRESS',
  BLOCKED: 'BLOCKED',
  IN_REVIEW: 'IN_REVIEW',
  REOPENED: 'REOPENED',
  READY_FOR_QA: 'READY_FOR_QA',
  READY_FOR_PRODUCTION: 'READY_FOR_PRODUCTION',
  DONE: 'DONE',
} as const;

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TO_DO]: 'TO DO',
  [TaskStatus.IN_PROGRESS]: 'IN PROGRESS',
  [TaskStatus.BLOCKED]: 'BLOCKED',
  [TaskStatus.IN_REVIEW]: 'IN REVIEW',
  [TaskStatus.REOPENED]: 'REOPENED',
  [TaskStatus.READY_FOR_QA]: 'READY FOR QA',
  [TaskStatus.READY_FOR_PRODUCTION]: 'READY FOR PRODUCTION',
  [TaskStatus.DONE]: 'DONE',
};

export interface Task {
  id: string;
  project_id: string;
  epic_id?: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskPayload {
  project_id: string;
  epic_id?: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  status?: string;
}
