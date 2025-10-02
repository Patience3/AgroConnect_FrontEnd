import { useState } from 'react';
import { useAuthContext } from '@/context/AuthProvider';
import { ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';

const RoleSwitcher = () => {
  const { user, currentRole, switchRole } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);

  if (!user || !user.roles || user.roles.length <= 1) {
    return null;
  }

  const roleIcons = {
    buyer: '🛒',
    farmer: '🌾',
    officer: '👨‍🌾',
  };

  const roleLabels = {
    buyer: 'Buyer',
    farmer: 'Farmer',
    officer: 'Extension Officer',
  };

  const handleRoleSwitch = (role) => {
    switchRole(role);
    setIsOpen(false);
    // Redirect to appropriate dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-lg hover:bg-neutral-800 transition-colors"
      >
        <span className="text-lg">{roleIcons[currentRole]}</span>
        <span className="font-medium capitalize">{roleLabels[currentRole]}</span>
        <ChevronDown
          size={16}
          className={clsx(
            'transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 right-0 w-56 bg-primary-light border border-neutral-800 rounded-lg shadow-card z-50 overflow-hidden">
            <div className="p-2">
              <p className="text-xs text-neutral-500 px-3 py-2">Switch Role</p>
              {user.roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={clsx(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left',
                    role === currentRole
                      ? 'bg-accent-teal/20 text-accent-cyan'
                      : 'text-neutral-300 hover:bg-primary-dark'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{roleIcons[role]}</span>
                    <span className="font-medium capitalize">{roleLabels[role]}</span>
                  </div>
                  {role === currentRole && (
                    <Check size={16} className="text-accent-cyan" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoleSwitcher;