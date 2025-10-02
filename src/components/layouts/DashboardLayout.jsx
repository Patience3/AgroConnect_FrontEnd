import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthProvider';
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  Package,
  TrendingUp,
  Users,
  Calendar,
  Settings,
  LogOut,
  Bell,
  User,
} from 'lucide-react';
import clsx from 'clsx';

const DashboardLayout = () => {
  const { user, currentRole, logout, switchRole } = useAuthContext();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Navigation items based on role
  const getNavigationItems = () => {
    const commonItems = [];

    if (currentRole === 'buyer') {
      return [
        { name: 'Marketplace', href: '/dashboard/marketplace', icon: ShoppingBag },
        { name: 'My Orders', href: '/dashboard/orders', icon: Package },
      ];
    }

    if (currentRole === 'farmer') {
      return [
        { name: 'Dashboard', href: '/dashboard/farmer', icon: Home },
        { name: 'Products', href: '/dashboard/farmer/products', icon: Package },
        { name: 'Orders', href: '/dashboard/farmer/orders', icon: TrendingUp },
      ];
    }

    if (currentRole === 'officer') {
      return [
        { name: 'Dashboard', href: '/dashboard/officer', icon: Home },
        { name: 'Farmers', href: '/dashboard/officer/farmers', icon: Users },
        { name: 'Schedule', href: '/dashboard/officer/schedule', icon: Calendar },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setDropdownOpen(false);
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-primary-dark">
      {/* Top Navigation */}
      <nav className="bg-primary-light border-b border-neutral-800 fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-neutral-300 hover:text-accent-cyan"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-cyan rounded-lg flex items-center justify-center">
                  <span className="text-primary-dark font-bold text-xl">A</span>
                </div>
                <span className="text-xl font-bold gradient-text hidden sm:block">
                  AgroConnect
                </span>
              </Link>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              {/* Role badge */}
              <div className="hidden md:block">
                <span className="badge-cyan capitalize">{currentRole}</span>
              </div>

              {/* Notifications */}
              <button className="relative text-neutral-300 hover:text-accent-cyan">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-neutral-300 hover:text-accent-cyan"
                >
                  <div className="w-8 h-8 rounded-full bg-accent-teal/20 flex items-center justify-center">
                    <User size={16} className="text-accent-cyan" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.full_name}
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-primary-light border border-neutral-800 rounded-lg shadow-card">
                    <div className="p-3 border-b border-neutral-800">
                      <p className="text-sm font-medium text-neutral-100">
                        {user?.full_name}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {user?.email}
                      </p>
                    </div>

                    {/* Switch role */}
                    {user?.roles && user.roles.length > 1 && (
                      <div className="p-2 border-b border-neutral-800">
                        <p className="text-xs text-neutral-500 px-2 py-1">
                          Switch Role
                        </p>
                        {user.roles.map((role) => (
                          <button
                            key={role}
                            onClick={() => handleRoleSwitch(role)}
                            className={clsx(
                              'w-full text-left px-3 py-2 text-sm rounded-md transition-colors capitalize',
                              role === currentRole
                                ? 'bg-accent-teal/20 text-accent-cyan'
                                : 'text-neutral-300 hover:bg-primary-dark'
                            )}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="p-2">
                      <button
                        onClick={() => {}}
                        className="w-full text-left px-3 py-2 text-sm text-neutral-300 hover:bg-primary-dark rounded-md flex items-center gap-2"
                      >
                        <Settings size={16} />
                        Settings
                      </button>
                      <button
                        onClick={logout}
                        className="w-full text-left px-3 py-2 text-sm text-error hover:bg-error/10 rounded-md flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex">
        {/* Sidebar */}
        <aside
          className={clsx(
            'fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-primary-light border-r border-neutral-800 transition-transform duration-300 z-40',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          )}
        >
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-accent-teal/20 text-accent-cyan border border-accent-teal/30'
                      : 'text-neutral-300 hover:bg-primary-dark hover:text-accent-cyan'
                  )}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;