import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../../ui/logo';
import { useLogout } from '../../../hooks/useLogout';
import { ArrowIcon, LogoutIcon, MenuIcon } from '../../ui/icons';
import { menuItems } from '../../../constants/navigation';

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      toast.error('Failed to logout. Please try again.');
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Burger Menu Button - Mobile & Tablet */}
      <div className="fixed top-5 left-4 flex gap-4 lg:hidden p-2  ">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <span className="text-xl font-bold text-slate-dark tracking-tight">
          TASKLY
        </span>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative top-0 h-screen bg-primary-light z-40 
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'w-64' : 'w-20'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6">
            {isExpanded ? (
              <Logo />
            ) : (
              <img src="/favicon.svg" alt="Logo" className="w-6 h-6" />
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-6 px-3 ">
            {menuItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
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
                    <item.Icon
                      className="shrink-0"
                      color={isActive ? 'var(--color-primary)' : 'currentColor'}
                    />
                    {isExpanded && (
                      <span className="text-body-md font-medium">
                        {item.label}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 pt-4 space-y-2 border-t border-slate-light/30">
            {/* Collapse Button - Desktop */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`hidden lg:flex items-center gap-4 w-full px-4 py-3 text-slate-medium hover:bg-surface-low rounded-md transition-colors cursor-pointer `}
            >
              <ArrowIcon
                className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                color="currentColor"
              />
              {isExpanded && (
                <span className="text-body-md font-medium">Collapse</span>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`flex items-center gap-4 w-full px-4 py-3 text-error hover:bg-error-low rounded-md transition-colors cursor-pointer `}
            >
              <LogoutIcon className="shrink-0" color="currentColor" />
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
