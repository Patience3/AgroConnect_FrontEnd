// src/components/DevModeIndicator.jsx
import { useState } from 'react';
import { 
  DEVELOPMENT_MODE, 
  DEFAULT_MOCK_USER, 
  MOCK_USERS,
  getMockUser,
  initDevMode 
} from '@/config/development';
import { X, RefreshCw, User } from 'lucide-react';

/**
 * Development Mode Indicator
 * Shows when dev mode is active and allows switching between mock users
 */
const DevModeIndicator = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUser, setSelectedUser] = useState(DEFAULT_MOCK_USER);

  if (!DEVELOPMENT_MODE || import.meta.env.MODE !== 'development') {
    return null;
  }

  const currentUser = getMockUser(selectedUser);

  const handleUserSwitch = (userKey) => {
    setSelectedUser(userKey);
    const user = getMockUser(userKey);
    
    // Update localStorage
    localStorage.setItem('user_data', JSON.stringify(user));
    localStorage.setItem('current_role', user.roles[0]);
    
    // Reload to apply changes
    window.location.reload();
  };

  const handleReset = () => {
    initDevMode();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        // Collapsed view
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-warning text-primary-dark px-4 py-2 rounded-full shadow-lg font-bold flex items-center gap-2 hover:bg-yellow-400 transition-all"
          title="Development Mode Active"
        >
          🔧 DEV MODE
        </button>
      ) : (
        // Expanded view
        <div className="bg-primary-light border-2 border-warning rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              <h3 className="font-bold text-warning">Development Mode</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-neutral-400 hover:text-neutral-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current User */}
          <div className="mb-4 p-3 bg-accent-cyan/10 border border-accent-cyan/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <User size={16} className="text-accent-cyan" />
              <span className="text-sm font-semibold text-accent-cyan">Current User</span>
            </div>
            <p className="font-medium">{currentUser.full_name}</p>
            <p className="text-xs text-neutral-400">{currentUser.email}</p>
            <div className="flex gap-1 mt-2">
              {currentUser.roles.map(role => (
                <span key={role} className="text-xs px-2 py-0.5 bg-accent-teal/20 text-accent-cyan rounded-full capitalize">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* User Switcher */}
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2 text-neutral-300">Switch Mock User:</p>
            <div className="space-y-2">
              {Object.entries(MOCK_USERS).map(([key, user]) => (
                <button
                  key={key}
                  onClick={() => handleUserSwitch(key)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedUser === key
                      ? 'bg-accent-cyan/20 border border-accent-cyan'
                      : 'bg-primary-dark hover:bg-neutral-800 border border-neutral-800'
                  }`}
                >
                  <p className="font-medium text-sm">{user.full_name}</p>
                  <div className="flex gap-1 mt-1">
                    {user.roles.map(role => (
                      <span key={role} className="text-xs px-1.5 py-0.5 bg-neutral-800 text-neutral-400 rounded capitalize">
                        {role}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm transition-colors"
            >
              <RefreshCw size={14} />
              Reset
            </button>
          </div>

          {/* Info */}
          <div className="mt-3 pt-3 border-t border-neutral-800">
            <p className="text-xs text-neutral-500">
              💡 All API calls are mocked. No backend required.
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              📝 Edit mock data in <code className="text-accent-cyan">src/config/development.js</code>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevModeIndicator;