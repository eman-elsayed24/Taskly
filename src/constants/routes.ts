export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROJECTS: '/project',
  ADD_PROJECT: '/project/add',
  // Dynamic routes - for React Router path definitions
  PROJECT_EPICS_PATTERN: '/project/:projectId/epics',
  PROJECT_TASKS_PATTERN: '/project/:projectId/tasks',
  PROJECT_MEMBERS_PATTERN: '/project/:projectId/members',
  PROJECT_DETAILS_PATTERN: '/project/:projectId/edit',
  // Helper functions - for generating actual paths with IDs
  PROJECT_EPICS: (projectId: string) => `/project/${projectId}/epics`,
  PROJECT_TASKS: (projectId: string) => `/project/${projectId}/tasks`,
  PROJECT_MEMBERS: (projectId: string) => `/project/${projectId}/members`,
  PROJECT_DETAILS: (projectId: string) => `/project/${projectId}/edit`,
} as const;
