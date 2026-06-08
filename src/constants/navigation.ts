import ProjectsIcon from '../assets/icons/projects.svg?react';
import EpicsIcon from '../assets/icons/epics.svg?react';
import TasksIcon from '../assets/icons/tasks.svg?react';
import MembersIcon from '../assets/icons/members.svg?react';
import DetailsIcon from '../assets/icons/details.svg?react';

export type MenuItem = {
  path: string;
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
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
