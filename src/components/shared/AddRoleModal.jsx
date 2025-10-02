import React, { useState } from 'react';
import { X, User, ShoppingBag, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

const AddRoleModal = ({ isOpen, onClose, onSubmit, currentRoles = [] }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 'farmer',
      name: 'Farmer',
      description: 'Sell your agricultural products directly to buyers',
      icon: <User className="w-8 h-8" />,
      color: 'green',
      features: [
        'List and sell products',
        'Manage inventory',
        'Process orders',
        'Request extension officer visits'
      ]
    },
    {
      id: 'buyer',
      name: 'Buyer',
      description: 'Purchase fresh produce directly from farmers',
      icon: <ShoppingBag className="w-8 h-8" />,
      color: 'blue',
      features: [
        'Browse marketplace',
        'Place orders',
        'Track deliveries',
        'Save favorite products'
      ]
    },
    {
      id: 'officer',
      name: 'Extension Officer',
      description: 'Provide agricultural advisory services to farmers',
      icon: <Briefcase className="w-8 h-8" />,
      color: 'purple',
      features: [
        'Manage farmer visits',
        'Provide consultations',
        'Verify farms',
        'Monitor farming practices'
      ]
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      blue: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
    };
    return colors[color];
  };

  const getSelectedColorClasses = (color) => {
    const colors = {
      green: 'bg-green-500 border-green-600 text-white',
      blue: 'bg-blue-500 border-blue-600 text-white',
      purple: 'bg-purple-500 border-purple-600 text-white'
    };
    return colors[color];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    if (currentRoles.includes(selectedRole)) {
      setError('You already have this role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(selectedRole);
      setSelectedRole('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Add New Role</h2>
            <p className="text-sm text-gray-600 mt-1">Choose a role to expand your marketplace capabilities</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Current Roles Info */}
        {currentRoles.length > 0 && (
          <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium mb-2">Your Current Roles:</p>
            <div className="flex flex-wrap gap-2">
              {currentRoles.map(role => (
                <span key={role} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Role Selection */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {roles.map(role => {
              const isCurrentRole = currentRoles.includes(role.id);
              const isSelected = selectedRole === role.id;

              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => !isCurrentRole && setSelectedRole(role.id)}
                  disabled={isCurrentRole}
                  className={`p-6 border-2 rounded-lg text-left transition-all ${
                    isCurrentRole
                      ? 'bg-gray-50 border-gray-200 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? getSelectedColorClasses(role.color)
                      : `${getColorClasses(role.color)} border-2`
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-white bg-opacity-20' : ''}`}>
                      {role.icon}
                    </div>
                    {isCurrentRole && (
                      <span className="ml-auto">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </span>
                    )}
                    {isSelected && !isCurrentRole && (
                      <span className="ml-auto">
                        <CheckCircle className="w-5 h-5" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold mb-2">{role.name}</h3>
                  <p className={`text-sm mb-4 ${isSelected && !isCurrentRole ? 'text-white text-opacity-90' : 'opacity-75'}`}>
                    {role.description}
                  </p>

                  <div className="space-y-1.5">
                    {role.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isSelected && !isCurrentRole ? 'text-white' : ''}`} />
                        <span className={isSelected && !isCurrentRole ? 'text-white' : ''}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {isCurrentRole && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <span className="text-sm font-semibold text-gray-600">Already Active</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Additional Information */}
          {selectedRole && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900 mb-1">Important Information</p>
                  <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    <li>You can switch between roles at any time</li>
                    <li>Each role has its own dashboard and features</li>
                    <li>Your account settings remain the same across all roles</li>
                    {selectedRole === 'farmer' && (
                      <li>You'll need to complete your farmer profile after adding this role</li>
                    )}
                    {selectedRole === 'officer' && (
                      <li>Extension officer roles require verification by administration</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedRole || loading}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding Role...
                </span>
              ) : (
                'Add Role'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;