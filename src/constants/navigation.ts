import ProjectsIcon from '../assets/icons/projects.svg?react';
import EpicsIcon from '../assets/icons/epics.svg?react';
import TasksIcon from '../assets/icons/tasks.svg?react';
import MembersIcon from '../assets/icons/members.svg?react';
import DetailsIcon from '../assets/icons/details.svg?react';
import { ROUTES } from './routes';

export type MenuItem = {
  path: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const menuItems: MenuItem[] = [
  {
    path: ROUTES.PROJECTS,
    label: 'Projects',
    Icon: ProjectsIcon,
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
