import ProjectsIcon from '../assets/icons/projects.svg?react';
import EpicsIcon from '../assets/icons/epics.svg?react';
import TasksIcon from '../assets/icons/tasks.svg?react';
import MembersIcon from '../assets/icons/members.svg?react';
import DetailsIcon from '../assets/icons/details.svg?react';
import MonitoringIcon from '../assets/icons/monitoring.svg?react';
import { ROUTES } from './routes';

export type MenuItem = {
  path: string | ((projectId: string) => string);
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isGlobal?: boolean; // Items that appear outside of project context
};

export const menuItems: MenuItem[] = [
  {
    path: ROUTES.PROJECTS,
    label: 'Projects',
    Icon: ProjectsIcon,
    isGlobal: true,
  },
  {
    path: ROUTES.MY_STATISTICS,
    label: 'My Statistics',
    Icon: MonitoringIcon,
    isGlobal: true,
  },
  {
    path: ROUTES.PROJECT_EPICS,
    label: 'Project Epics',
    Icon: EpicsIcon,
  },
  {
    path: ROUTES.PROJECT_TASKS,
    label: 'Project Tasks',
    Icon: TasksIcon,
  },
  {
    path: ROUTES.PROJECT_MEMBERS,
    label: 'Project Members',
    Icon: MembersIcon,
  },
  {
    path: ROUTES.PROJECT_DETAILS,
    label: 'Project Details',
    Icon: DetailsIcon,
  },
];
