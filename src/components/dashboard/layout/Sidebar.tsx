import { useState, useMemo } from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../../ui/logo';
import { useLogout } from '../../../hooks/useLogout';
import ArrowIcon from '../../../assets/icons/arrow.svg?react';
import LogoutIcon from '../../../assets/icons/logout.svg?react';
import MenuIcon from '../../../assets/icons/menu.svg?react';
import { menuItems } from '../../../constants/navigation';
import { ROUTES } from '../../../constants/routes';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout } = useLogout();
  const { projectId } = useParams<{ projectId: string }>();
  const location = useLocation();

  // Check if we're in a project context
  const isInProject = useMemo(() => {
    return location.pathname.includes('/project/') && projectId;
  }, [location.pathname, projectId]);

  // Generate menu items based on context
  const visibleMenuItems = useMemo(() => {
    if (!isInProject) {
      // Only show Projects link when not in a project
      return menuItems.filter(item => item.path === ROUTES.PROJECTS);
    }

    // Show all menu items with proper paths when in a project
    return menuItems.map(item => {
      if (item.path === ROUTES.PROJECTS) {
        return item;
      }

      // Replace function routes with actual paths
      if (typeof item.path === 'function' && projectId) {
        return {
          ...item,
          path: item.path(projectId),
        };
      }

      return item;
    });
  }, [isInProject, projectId]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div className="fixed top-5 left-4 flex gap-4 lg:hidden p-2 ">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          <MenuIcon className="w-6 h-6 text-slate-dark" />
        </button>
        <span className="text-xl font-bold text-slate-dark tracking-tight">
          TASKLY
        </span>
      </div>

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen bg-primary-light z-40 
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-20'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="h-16 flex items-center px-6 shrink-0">
            {isExpanded ? (
              <Logo />
            ) : (
              <img src="/favicon.svg" alt="Logo" className="w-6 h-6" />
            )}
          </div>

          <nav className="flex-1 py-6 px-3 ">
            {visibleMenuItems.map((item, index) => {
              const Icon = item.Icon;
              const itemPath =
                typeof item.path === 'string' ? item.path : String(item.path);

              return (
                <NavLink
                  key={`${itemPath}-${index}`}
                  to={itemPath}
                  end
                  onClick={() => setIsMobileOpen(false)}
                >
                  {({ isActive }) => (
                    <div
                      className={`flex items-center gap-4 px-4 py-3 mb-2 rounded-sm transition-all duration-200
                    ${
                      isActive
                        ? 'bg-white text-primary'
                        : 'text-slate-dark hover:bg-surface-low'
                    }
                    ${!isExpanded && 'justify-center'}
                  `}
                    >
                      <Icon
                        className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-slate-dark'}`}
                      />
                      {isExpanded && (
                        <span className="text-body-md font-medium">
                          {item.label}
                        </span>
                      )}
                    </div>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <div className="p-3 pt-4 space-y-2 border-t border-slate-light/30 shrink-0">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="hidden lg:flex items-center gap-4 w-full px-4 py-3 text-slate-medium hover:bg-surface-low rounded-md transition-colors cursor-pointer"
            >
              <ArrowIcon
                className={`shrink-0 w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
              {isExpanded && (
                <span className="text-body-md font-medium">Collapse</span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 text-error hover:bg-error-low rounded-md transition-colors cursor-pointer"
            >
              <LogoutIcon className="shrink-0 w-5 h-5" />
              {isExpanded && (
                <span className="text-body-md font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
