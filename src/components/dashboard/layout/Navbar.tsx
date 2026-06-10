import { useState, useRef, useEffect } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { useLogout } from '../../../hooks/useLogout';
import LogoutIcon from '../../../assets/icons/logout.svg?react';
import { getInitials } from '../../../utils/stringHelpers';

export default function Navbar() {
  const { data: user } = useAppSelector(state => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <nav className=" border-b border-slate-light h-16 flex items-center justify-end px-4 md:px-6">
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="hidden sm:block text-right">
            <p className="text-body-md font-semibold text-slate-dark">
              {user?.name || 'User'}
            </p>
            <p className="text-body-md text-primary">{user?.jobTitle || ''}</p>
          </div>

          <div className="w-10 h-10 rounded-md bg-primary-container flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getInitials(user?.name)}
            </span>
          </div>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-slate-light z-50 overflow-hidden">
            <div className="sm:hidden p-4 border-b border-slate-light">
              <p className="text-body-md font-semibold text-slate-dark">
                {user?.name || 'User'}
              </p>
              <p className="text-body-md text-primary">
                {user?.jobTitle || ''}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-error hover:bg-error-low transition-colors cursor-pointer"
            >
              <LogoutIcon className="shrink-0 w-5 h-5" />
              <span className="text-body-md font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
