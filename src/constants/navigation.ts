import {
  ProjectsIcon,
  EpicsIcon,
  TasksIcon,
  MembersIcon,
  DetailsIcon,
} from '../components/ui/icons';

export type MenuItem = {
  path: string;
  label: string;
  Icon: React.ComponentType<{ className?: string; color?: string }>;
};

export const menuItems: MenuItem[] = [
  {
    path: '/dashboard/projects',
    label: 'Projects',
    Icon: ProjectsIcon,
  },
  {
    path: '/dashboard/project-epics',
    label: 'Project Epics',
    Icon: EpicsIcon,
  },
  {
    path: '/dashboard/project-tasks',
    label: 'Project Tasks',
    Icon: TasksIcon,
  },
  {
    path: '/dashboard/project-members',
    label: 'Project Members',
    Icon: MembersIcon,
  },
  {
    path: '/dashboard/project-details',
    label: 'Project Details',
    Icon: DetailsIcon,
  },
];
