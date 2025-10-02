import { useState } from 'react';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import authService from '@/services/authService';

const ChangePasswordForm = ({ onClose, onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.new_password.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.new_password) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.new_password) },
    { label: 'Contains number', met: /\d/.test(formData.new_password) },
  ];

  const allRequirementsMet = passwordRequirements.every(req => req.met);
  const passwordsMatch = formData.new_password === formData.confirm_password && formData.new_password !== '';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allRequirementsMet) {
      setError('Password does not meet all requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await authService.changePassword(
        formData.current_password,
        formData.new_password
      );
      if (onSuccess) onSuccess('Password changed successfully');
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>

      {error && (
        <div className="mb-6 bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <div className="relative">
            <Input
              label="Current Password"
              name="current_password"
              type={showPasswords.current ? 'text' : 'password'}
              placeholder="Enter current password"
              value={formData.current_password}
              onChange={handleChange}
              icon={Lock}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('current')}
              className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-300"
            >
              {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <div className="relative">
            <Input
              label="New Password"
              name="new_password"
              type={showPasswords.new ? 'text' : 'password'}
              placeholder="Enter new password"
              value={formData.new_password}
              onChange={handleChange}
              icon={Lock}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('new')}
              className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-300"
            >
              {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Requirements */}
          {formData.new_password && (
            <div className="mt-3 p-3 bg-primary-dark rounded-lg">
              <p className="text-xs text-neutral-400 mb-2">Password must have:</p>
              <div className="space-y-1">
                {passwordRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {req.met ? (
                      <CheckCircle size={14} className="text-success" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-neutral-600" />
                    )}
                    <span className={`text-xs ${req.met ? 'text-success' : 'text-neutral-500'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <Input
              label="Confirm New Password"
              name="confirm_password"
              type={showPasswords.confirm ? 'text' : 'password'}
              placeholder="Confirm new password"
              value={formData.confirm_password}
              onChange={handleChange}
              icon={Lock}
              required
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility('confirm')}
              className="absolute right-3 top-9 text-neutral-400 hover:text-neutral-300"
            >
              {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Password Match Indicator */}
          {formData.confirm_password && (
            <div className="mt-2 flex items-center gap-2">
              {passwordsMatch ? (
                <>
                  <CheckCircle size={14} className="text-success" />
                  <span className="text-xs text-success">Passwords match</span>
                </>
              ) : (
                <>
                  <AlertCircle size={14} className="text-error" />
                  <span className="text-xs text-error">Passwords do not match</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          {onClose && (
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
              fullWidth
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading || !allRequirementsMet || !passwordsMatch}
            fullWidth
          >
            Change Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChangePasswordForm;