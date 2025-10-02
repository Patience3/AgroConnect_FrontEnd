import { useState } from 'react';
import { User, ShoppingBag, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const AddRoleModal = ({ isOpen, onClose, onSubmit, currentRoles = [] }) => {
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = [
    {
      id: 'farmer',
      name: 'Farmer',
      description: 'Sell your agricultural products directly to buyers',
      icon: User,
      color: 'green',
    },
    {
      id: 'buyer',
      name: 'Buyer',
      description: 'Purchase fresh produce directly from farmers',
      icon: ShoppingBag,
      color: 'blue',
    },
    {
      id: 'officer',
      name: 'Extension Officer',
      description: 'Provide agricultural advisory services to farmers',
      icon: Briefcase,
      color: 'purple',
    },
  ];

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Role" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {currentRoles.length > 0 && (
          <Alert variant="info">
            <p className="font-medium mb-2">Your Current Roles:</p>
            <div className="flex flex-wrap gap-2">
              {currentRoles.map(role => (
                <span key={role} className="badge-success capitalize">
                  {role}
                </span>
              ))}
            </div>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roles.map(role => {
            const isCurrentRole = currentRoles.includes(role.id);
            const isSelected = selectedRole === role.id;
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                type="button"
                onClick={() => !isCurrentRole && setSelectedRole(role.id)}
                disabled={isCurrentRole}
                className={`p-6 border-2 rounded-lg text-left transition-all ${
                  isCurrentRole
                    ? 'bg-neutral-800 border-neutral-700 opacity-50 cursor-not-allowed'
                    : isSelected
                    ? 'border-accent-cyan bg-accent-cyan/10'
                    : 'border-neutral-700 hover:border-accent-teal'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-accent-cyan/20' : 'bg-neutral-800'}`}>
                    <Icon size={24} className={isSelected ? 'text-accent-cyan' : 'text-neutral-400'} />
                  </div>
                  {isCurrentRole && (
                    <CheckCircle size={20} className="text-success ml-auto" />
                  )}
                </div>

                <h3 className="text-lg font-bold mb-2">{role.name}</h3>
                <p className="text-sm text-neutral-400 mb-4">{role.description}</p>

                {isCurrentRole && (
                  <span className="text-sm font-semibold text-success">Already Active</span>
                )}
              </button>
            );
          })}
        </div>

        {selectedRole && (
          <Alert variant="warning">
            <p className="font-semibold mb-1">Important Information</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>You can switch between roles at any time</li>
              <li>Each role has its own dashboard and features</li>
              {selectedRole === 'farmer' && (
                <li>You'll need to complete your farmer profile after adding this role</li>
              )}
              {selectedRole === 'officer' && (
                <li>Extension officer roles require verification by administration</li>
              )}
            </ul>
          </Alert>
        )}

        <div className="flex gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!selectedRole || loading}
            loading={loading}
            fullWidth
          >
            Add Role
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddRoleModal;