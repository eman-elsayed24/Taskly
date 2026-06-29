export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  ACCEPT_INVITATION: '/invite',
  PROJECTS: '/project',
  ADD_PROJECT: '/project/add',
  // Dynamic routes - for React Router path definitions
  PROJECT_EPICS_PATTERN: '/project/:projectId/epics',
  ADD_EPIC_PATTERN: '/project/:projectId/epics/new',
  PROJECT_TASKS_PATTERN: '/project/:projectId/tasks',
  ADD_TASK_PATTERN: '/project/:projectId/tasks/new',
  PROJECT_MEMBERS_PATTERN: '/project/:projectId/members',
  PROJECT_DETAILS_PATTERN: '/project/:projectId/edit',
  // Helper functions - for generating actual paths with IDs
  PROJECT_EPICS: (projectId: string) => `/project/${projectId}/epics`,
  ADD_EPIC: (projectId: string) => `/project/${projectId}/epics/new`,
  PROJECT_TASKS: (projectId: string) => `/project/${projectId}/tasks`,
  ADD_TASK: (projectId: string) => `/project/${projectId}/tasks/new`,
  PROJECT_MEMBERS: (projectId: string) => `/project/${projectId}/members`,
  PROJECT_DETAILS: (projectId: string) => `/project/${projectId}/edit`,
} as const;
