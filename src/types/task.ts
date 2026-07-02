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

export interface CreateTaskPayload {
  project_id: string;
  epic_id?: string;
  title: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  status?: string;
}

export interface TaskDetails {
  id: string;
  task_id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
  epic_id: string | null;
  epic?: {
    id: string;
    epic_id: string;
    title: string;
  } | null;
  assignee: {
    name: string;
    department: string | null;
  } | null;
  created_by: {
    name: string;
    department: string | null;
  } | null;
}

export type TaskAssignee = NonNullable<TaskDetails['assignee']>;
export type TaskEpic = NonNullable<TaskDetails['epic']>;
export type TaskCreator = NonNullable<TaskDetails['created_by']>;
