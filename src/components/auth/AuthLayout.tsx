import { Outlet } from 'react-router-dom';
import Logo from '../ui/logo';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Logo />
      </div>

      {/* Content Container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-white rounded-md shadow-lg p-8 md:p-12">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
