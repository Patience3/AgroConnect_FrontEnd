// src/pages/farmer/FarmerProfilePage.jsx
import { useState, useEffect } from 'react';
import { User, MapPin, Phone, Mail, Calendar, Award, Leaf, Edit, Camera } from 'lucide-react';
import { useAuthContext } from '@/context/AuthProvider';
import authService from '@/services/authService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import LoadingScreen from '@/components/ui/LoadingScreen';
import Alert from '@/components/ui/Alert';
import useNotifications from '@/hooks/useNotifications';
import { formatDate } from '@/utils/helpers';

const FarmerProfilePage = () => {
  const { user, updateUser } = useAuthContext();
  const { success, error: showError } = useNotifications();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    farm_name: '',
    farm_size_hectares: '',
    primary_crops: [],
    farming_experience_years: '',
    farming_methods: [],
    certifications: [],
    location: '',
    profile_image_url: '',
  });

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
        farm_name: data.farm_name || '',
        farm_size_hectares: data.farm_size_hectares || '',
        primary_crops: data.primary_crops || [],
        farming_experience_years: data.farming_experience_years || '',
        farming_methods: data.farming_methods || [],
        certifications: data.certifications || [],
        location: data.location || '',
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
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
      success('Success', 'Profile image updated');
    } catch (err) {
      showError('Error', err.message || 'Failed to upload image');
    }
  };

  const handleSave = async () => {
    setError('');
    setIsSaving(true);

    try {
      const updatedUser = await authService.updateProfile(profileData);
      updateUser(updatedUser);
      setIsEditing(false);
      success('Success', 'Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    loadProfile();
  };

  if (isLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Farmer Profile</h1>
          <p className="text-neutral-400">Manage your farm information and credentials</p>
        </div>
        {!isEditing ? (
          <Button icon={Edit} onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} loading={isSaving} disabled={isSaving}>
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
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
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-accent-cyan rounded-full flex items-center justify-center cursor-pointer hover:bg-accent-teal transition-colors">
                  <Camera size={20} className="text-primary-dark" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2">{profileData.full_name}</h2>
            <p className="text-neutral-400 mb-4">{profileData.farm_name}</p>

            <div className="flex items-center justify-center gap-2 mb-6">
              {user?.is_verified_farmer && (
                <Badge variant="success">
                  <Award size={12} className="mr-1" />
                  Verified Farmer
                </Badge>
              )}
              {profileData.farming_experience_years && (
                <Badge variant="info">
                  {profileData.farming_experience_years} years
                </Badge>
              )}
            </div>

            {/* Member Since */}
            <div className="pt-4 border-t border-neutral-800">
              <p className="text-sm text-neutral-500 mb-1">Member since</p>
              <p className="font-medium">{formatDate(user?.created_at || new Date())}</p>
            </div>
          </div>
        </Card>

        {/* Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card title="Personal Information">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  name="full_name"
                  value={profileData.full_name}
                  onChange={handleInputChange}
                  icon={User}
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  icon={Mail}
                />
                <Input
                  label="Phone Number"
                  name="phone_number"
                  type="tel"
                  value={profileData.phone_number}
                  onChange={handleInputChange}
                  icon={Phone}
                />
                <Input
                  label="Location"
                  name="location"
                  value={profileData.location}
                  onChange={handleInputChange}
                  icon={MapPin}
                  placeholder="City, Region"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-neutral-500" />
                  <span className="text-neutral-300">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-neutral-500" />
                  <span className="text-neutral-300">{profileData.phone_number}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-neutral-500" />
                  <span className="text-neutral-300">
                    {profileData.location || 'Not specified'}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Farm Information */}
          <Card title="Farm Information">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Farm Name"
                  name="farm_name"
                  value={profileData.farm_name}
                  onChange={handleInputChange}
                />
                <Input
                  label="Farm Size (Hectares)"
                  name="farm_size_hectares"
                  type="number"
                  value={profileData.farm_size_hectares}
                  onChange={handleInputChange}
                />
                <Input
                  label="Farming Experience (Years)"
                  name="farming_experience_years"
                  type="number"
                  value={profileData.farming_experience_years}
                  onChange={handleInputChange}
                  icon={Calendar}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Farm Size</p>
                  <p className="text-neutral-300">{profileData.farm_size_hectares} hectares</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Experience</p>
                  <p className="text-neutral-300">
                    {profileData.farming_experience_years} years
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Primary Crops */}
          <Card title="Primary Crops">
            {isEditing ? (
              <div>
                <Input
                  placeholder="Enter crops separated by commas"
                  defaultValue={profileData.primary_crops?.join(', ')}
                  onBlur={(e) => handleArrayInput('primary_crops', e.target.value)}
                  icon={Leaf}
                />
                <p className="text-xs text-neutral-500 mt-2">
                  Separate multiple crops with commas
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {profileData.primary_crops?.length > 0 ? (
                  profileData.primary_crops.map((crop, index) => (
                    <Badge key={index} variant="success">
                      {crop}
                    </Badge>
                  ))
                ) : (
                  <p className="text-neutral-500">No crops specified</p>
                )}
              </div>
            )}
          </Card>

          {/* Farming Methods & Certifications */}
          <Card title="Methods & Certifications">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Farming Methods
                  </label>
                  <Input
                    placeholder="e.g., Organic, Traditional, Modern"
                    defaultValue={profileData.farming_methods?.join(', ')}
                    onBlur={(e) => handleArrayInput('farming_methods', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Certifications
                  </label>
                  <Input
                    placeholder="e.g., Organic Certified, GAP"
                    defaultValue={profileData.certifications?.join(', ')}
                    onBlur={(e) => handleArrayInput('certifications', e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-400 mb-2">Farming Methods</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.farming_methods?.length > 0 ? (
                      profileData.farming_methods.map((method, index) => (
                        <Badge key={index} variant="info">
                          {method}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-neutral-500 text-sm">No methods specified</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-neutral-400 mb-2">Certifications</p>
                  <div className="flex flex-wrap gap-2">
                    {profileData.certifications?.length > 0 ? (
                      profileData.certifications.map((cert, index) => (
                        <Badge key={index} variant="cyan">
                          <Award size={12} className="mr-1" />
                          {cert}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-neutral-500 text-sm">No certifications</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfilePage;