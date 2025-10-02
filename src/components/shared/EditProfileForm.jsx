import { useState } from 'react';
import { useAuthContext } from '@/context/AuthProvider';
import { User, Mail, Phone, MapPin, Camera, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import authService from '@/services/authService';

const EditProfileForm = ({ onClose, onSuccess }) => {
  const { user, updateUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
    location: user?.location || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    try {
      setIsLoading(true);
      const response = await authService.uploadProfileImage(file);
      updateUser({ ...user, profile_image_url: response.image_url });
      if (onSuccess) onSuccess('Profile image updated successfully');
    } catch (err) {
      setError(err.message || 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const updatedUser = await authService.updateProfile(formData);
      updateUser(updatedUser);
      if (onSuccess) onSuccess('Profile updated successfully');
      if (onClose) onClose();
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      {error && (
        <div className="mb-6 bg-error/10 border border-error/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </div>
      )}

      {/* Profile Image */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-accent-teal/20 flex items-center justify-center overflow-hidden">
            {user?.profile_image_url ? (
              <img
                src={user.profile_image_url}
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={40} className="text-accent-cyan" />
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-8 h-8 bg-accent-cyan rounded-full flex items-center justify-center cursor-pointer hover:bg-accent-teal transition-colors">
            <Camera size={16} className="text-primary-dark" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-neutral-500 mt-2">
          Click to upload profile photo (max 5MB)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="full_name"
          type="text"
          placeholder="John Doe"
          value={formData.full_name}
          onChange={handleChange}
          icon={User}
          required
        />

        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          icon={Mail}
          required
        />

        <Input
          label="Phone Number"
          name="phone_number"
          type="tel"
          placeholder="+233501234567"
          value={formData.phone_number}
          onChange={handleChange}
          icon={Phone}
          required
        />

        <Input
          label="Location"
          name="location"
          type="text"
          placeholder="Accra, Ghana"
          value={formData.location}
          onChange={handleChange}
          icon={MapPin}
        />

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
            disabled={isLoading}
            fullWidth
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default EditProfileForm;