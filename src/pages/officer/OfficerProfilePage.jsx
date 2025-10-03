import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Award, Calendar, Edit, Camera } from 'lucide-react';
import { useAuthContext } from '@/context/AuthProvider';
import authService from '@/services/authService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Alert from '@/components/ui/Alert';
import EditProfileForm from '@/components/shared/EditProfileForm';
import ChangePasswordForm from '@/components/shared/ChangePasswordForm';
import AddRoleModal from '@/components/shared/AddRoleModal';
import useNotifications from '@/hooks/useNotifications';
import { formatDate } from '@/utils/helpers';

const OfficerProfilePage = () => {
  const { user, updateUser } = useAuthContext();
  const { success, error: showError } = useNotifications();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    location: '',
    bio: '',
    specialization: '',
    territory: '',
    certifications: [],
    languages: [],
    profile_image_url: '',
  });

  const stats = {
    farmers_supported: user?.farmers_supported || 156,
    total_visits: user?.total_visits || 89,
    verifications_completed: user?.verifications_completed || 124,
    average_rating: user?.average_rating || 4.7,
    years_experience: user?.years_experience || 8,
  };

  const achievements = [
    { title: 'Top Performer 2024', icon: '🏆', date: '2024-12-01' },
    { title: '100 Farmers Verified', icon: '✓', date: '2024-09-15' },
    { title: 'Excellence Award', icon: '⭐', date: '2024-06-01' },
    { title: 'Community Impact', icon: '💚', date: '2024-03-10' },
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getProfile();
      setProfileData({
        full_name: data.full_name || '',
        email: data.email || '',
        phone_number: data.phone_number || '',
        location: data.location || '',
        bio: data.bio || '',
        specialization: data.specialization || '',
        territory: data.territory || '',
        certifications: data.certifications || [],
        languages: data.languages || [],
        profile_image_url: data.profile_image_url || '',
      });
      updateUser(data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalSuccess = (message) => {
    success('Success', message);
    setActiveModal(null);
    loadProfile();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showError('Error', 'Image size must be less than 5MB');
      return;
    }

    try {
      const response = await authService.uploadProfileImage(file);
      setProfileData((prev) => ({
        ...prev,
        profile_image_url: response.image_url,
      }));
      updateUser({ ...user, profile_image_url: response.image_url });
      success('Success', 'Profile image updated');
    } catch (err) {
      showError('Error', err.message || 'Failed to upload image');
    }
  };

  const handleArrayInput = (field, value) => {
    const items = value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item);
    setProfileData((prev) => ({
      ...prev,
      [field]: items,
    }));
  };

  const handleUpdateOfficerDetails = async () => {
    try {
      setError('');
      const updatedUser = await authService.updateProfile(profileData);
      updateUser(updatedUser);
      success('Success', 'Officer details updated successfully');
      setActiveModal(null);
    } catch (err) {
      setError(err.message || 'Failed to update details');
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Officer Profile</h1>
          <p className="text-neutral-400">Manage your profile and credentials</p>
        </div>
        <Button
          icon={Edit}
          onClick={() => setActiveModal('edit-profile')}
        >
          Edit Profile
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="text-center">
              {/* Profile Image */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-accent-teal/20 flex items-center justify-center overflow-hidden">
                  {profileData.profile_image_url ? (
                    <img
                      src={profileData.profile_image_url}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={48} className="text-accent-cyan" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-accent-cyan rounded-full flex items-center justify-center cursor-pointer hover:bg-accent-teal transition-colors">
                  <Camera size={20} className="text-primary-dark" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <h2 className="text-2xl font-bold mb-2">{profileData.full_name}</h2>
              <p className="text-neutral-400 mb-4">{profileData.specialization}</p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                {user?.is_verified && (
                  <Badge variant="success">
                    <Award size={12} className="mr-1" />
                    Verified Officer
                  </Badge>
                )}
                <Badge variant="cyan">{stats.years_experience} years</Badge>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-primary-dark rounded-lg">
                  <p className="text-2xl font-bold text-accent-cyan">{stats.farmers_supported}</p>
                  <p className="text-xs text-neutral-400">Farmers</p>
                </div>
                <div className="p-3 bg-primary-dark rounded-lg">
                  <p className="text-2xl font-bold text-success">{stats.verifications_completed}</p>
                  <p className="text-xs text-neutral-400">Verified</p>
                </div>
                <div className="p-3 bg-primary-dark rounded-lg">
                  <p className="text-2xl font-bold text-accent-teal">{stats.total_visits}</p>
                  <p className="text-xs text-neutral-400">Visits</p>
                </div>
                <div className="p-3 bg-primary-dark rounded-lg">
                  <p className="text-2xl font-bold text-warning">{stats.average_rating}</p>
                  <p className="text-xs text-neutral-400">Rating</p>
                </div>
              </div>

              {/* Member Since */}
              <div className="pt-4 mt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-1">Member since</p>
                <p className="font-medium">{formatDate(user?.created_at || new Date())}</p>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card title="Achievements">
            <div className="space-y-3">
              {achievements.map((achievement, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-primary-dark rounded-lg"
                >
                  <div className="w-10 h-10 bg-accent-cyan/20 rounded-full flex items-center justify-center text-xl">
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{achievement.title}</p>
                    <p className="text-xs text-neutral-500">{formatDate(achievement.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <Card title="Contact Information">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-neutral-300">
                <Mail size={20} className="text-neutral-500" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <Phone size={20} className="text-neutral-500" />
                <span>{profileData.phone_number}</span>
              </div>
              <div className="flex items-center gap-3 text-neutral-300">
                <MapPin size={20} className="text-neutral-500" />
                <span>{profileData.location || 'Not specified'}</span>
              </div>
            </div>
          </Card>

          {/* Professional Details */}
          <Card title="Professional Details">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-400 mb-1">Territory</p>
                <p className="text-neutral-300">{profileData.territory || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-400 mb-1">Specialization</p>
                <p className="text-neutral-300">{profileData.specialization || 'Not specified'}</p>
              </div>
              {profileData.bio && (
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Bio</p>
                  <p className="text-neutral-300">{profileData.bio}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <Button
                size="sm"
                variant="secondary"
                icon={Edit}
                onClick={() => setActiveModal('edit-officer-details')}
              >
                Edit Details
              </Button>
            </div>
          </Card>

          {/* Certifications */}
          <Card title="Certifications">
            <div className="flex flex-wrap gap-2">
              {profileData.certifications?.length > 0 ? (
                profileData.certifications.map((cert, idx) => (
                  <Badge key={idx} variant="success">
                    <Award size={14} className="mr-1" />
                    {cert}
                  </Badge>
                ))
              ) : (
                <p className="text-neutral-500">No certifications added</p>
              )}
            </div>
          </Card>

          {/* Languages */}
          <Card title="Languages">
            <div className="flex flex-wrap gap-2">
              {profileData.languages?.length > 0 ? (
                profileData.languages.map((lang, idx) => (
                  <Badge key={idx} variant="cyan">
                    {lang}
                  </Badge>
                ))
              ) : (
                <p className="text-neutral-500">No languages specified</p>
              )}
            </div>
          </Card>

          {/* Account Settings */}
          <Card title="Account Settings">
            <div className="space-y-3">
              <button
                onClick={() => setActiveModal('change-password')}
                className="w-full p-4 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-accent-cyan text-xl">🔒</span>
                  <div>
                    <h4 className="font-medium">Change Password</h4>
                    <p className="text-sm text-neutral-400">Update your password</p>
                  </div>
                </div>
                <span className="text-neutral-500">→</span>
              </button>

              <button
                onClick={() => setActiveModal('add-role')}
                className="w-full p-4 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-accent-cyan text-xl">➕</span>
                  <div>
                    <h4 className="font-medium">Add Role</h4>
                    <p className="text-sm text-neutral-400">Become a farmer or buyer</p>
                  </div>
                </div>
                <span className="text-neutral-500">→</span>
              </button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card>
            <div className="border border-error/30 rounded-lg p-4 bg-error/5">
              <h3 className="font-semibold text-error mb-2">Danger Zone</h3>
              <p className="text-sm text-neutral-400 mb-4">
                Permanently delete your account and all associated data
              </p>
              <Button variant="danger" size="sm">
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={activeModal === 'edit-profile'}
        onClose={() => setActiveModal(null)}
        size="md"
      >
        <EditProfileForm
          onClose={() => setActiveModal(null)}
          onSuccess={handleModalSuccess}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'edit-officer-details'}
        onClose={() => setActiveModal(null)}
        size="md"
      >
        <Card>
          <h2 className="text-2xl font-bold mb-6">Edit Officer Details</h2>
          
          {error && (
            <Alert variant="error" onClose={() => setError('')} className="mb-6">
              {error}
            </Alert>
          )}

          <div className="space-y-4">
            <Input
              label="Specialization"
              value={profileData.specialization}
              onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
              placeholder="e.g., Organic Farming & Pest Management"
            />
            
            <Input
              label="Territory"
              value={profileData.territory}
              onChange={(e) => setProfileData({ ...profileData, territory: e.target.value })}
              placeholder="e.g., Greater Accra Region"
            />

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">
                Bio
              </label>
              <textarea
                rows="4"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                placeholder="Tell us about your experience..."
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Certifications
              </label>
              <Input
                placeholder="Enter certifications separated by commas"
                defaultValue={profileData.certifications?.join(', ')}
                onBlur={(e) => handleArrayInput('certifications', e.target.value)}
              />
              <p className="text-xs text-neutral-500 mt-2">
                Separate multiple certifications with commas
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">
                Languages
              </label>
              <Input
                placeholder="Enter languages separated by commas"
                defaultValue={profileData.languages?.join(', ')}
                onBlur={(e) => handleArrayInput('languages', e.target.value)}
              />
              <p className="text-xs text-neutral-500 mt-2">
                Separate multiple languages with commas
              </p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                variant="secondary"
                onClick={() => setActiveModal(null)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateOfficerDetails}
                fullWidth
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      </Modal>

      <Modal
        isOpen={activeModal === 'change-password'}
        onClose={() => setActiveModal(null)}
        size="md"
      >
        <ChangePasswordForm
          onClose={() => setActiveModal(null)}
          onSuccess={handleModalSuccess}
        />
      </Modal>

      <Modal
        isOpen={activeModal === 'add-role'}
        onClose={() => setActiveModal(null)}
        size="lg"
      >
        <AddRoleModal
          isOpen={activeModal === 'add-role'}
          onClose={() => setActiveModal(null)}
          currentRoles={user?.roles || []}
          onSubmit={async (role) => {
            await authService.addRole(role, {});
            handleModalSuccess('Role added successfully');
          }}
        />
      </Modal>
    </div>
  );
};

export default OfficerProfilePage;