import { useState } from 'react';
import { User, Leaf, Award, MapPin, Calendar, TrendingUp } from 'lucide-react';
import { useAuthContext } from '@/context/AuthProvider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EditProfileForm from '@/components/shared/EditProfileForm';
import ChangePasswordForm from '@/components/shared/ChangePasswordForm';
import AddRoleModal from '@/components/shared/AddRoleModal';
import useNotifications from '@/hooks/useNotifications';
import { formatDate } from '@/utils/helpers';

const FarmerProfilePage = () => {
  const { user } = useAuthContext();
  const { success } = useNotifications();
  const [activeModal, setActiveModal] = useState(null);

  const stats = {
    total_products: 23,
    total_orders: 87,
    total_revenue: 12450.50,
    average_rating: 4.8,
  };

  const farmDetails = {
    farm_name: user?.farm_name || 'Your Farm',
    farm_size_hectares: user?.farm_size_hectares || 5.5,
    farming_experience_years: user?.farming_experience_years || 8,
    primary_crops: user?.primary_crops || ['Tomatoes', 'Lettuce', 'Spinach'],
    farming_methods: user?.farming_methods || ['Organic', 'Traditional'],
    certifications: user?.certifications || ['Organic Certified'],
  };

  const handleModalSuccess = (message) => {
    success('Success', message);
    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Farmer Profile</h1>
        <p className="text-neutral-400">Manage your farm information and account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="space-y-6">
          <Card>
            <div className="text-center">
              {/* Profile Image */}
              <div className="w-24 h-24 rounded-full bg-accent-teal/20 flex items-center justify-center mx-auto mb-4">
                {user?.profile_image_url ? (
                  <img
                    src={user.profile_image_url}
                    alt={user.full_name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-accent-cyan" />
                )}
              </div>

              <h2 className="text-xl font-bold mb-1">{user?.full_name}</h2>
              <p className="text-neutral-400 mb-2">{farmDetails.farm_name}</p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                {user?.is_verified_farmer && (
                  <span className="badge-success">
                    <Award size={12} className="mr-1" />
                    Verified Farmer
                  </span>
                )}
                {farmDetails.farming_experience_years && (
                  <span className="badge-info">
                    {farmDetails.farming_experience_years} years
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500 mb-1">Member since</p>
                <p className="font-medium">{formatDate(user?.created_at || new Date())}</p>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card title="Your Activity">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Leaf className="text-accent-cyan" size={20} />
                  <span className="text-sm">Products Listed</span>
                </div>
                <span className="font-bold">{stats.total_products}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-accent-cyan">📦</span>
                  <span className="text-sm">Total Orders</span>
                </div>
                <span className="font-bold">{stats.total_orders}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-accent-cyan" size={20} />
                  <span className="text-sm">Total Revenue</span>
                </div>
                <span className="font-bold price">GHS {stats.total_revenue}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-warning text-xl">⭐</span>
                  <span className="text-sm">Average Rating</span>
                </div>
                <span className="font-bold">{stats.average_rating}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Settings & Preferences */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <Card title="Account Settings">
            <div className="space-y-3">
              <button
                onClick={() => setActiveModal('edit-profile')}
                className="w-full p-4 bg-primary-dark rounded-lg hover:bg-neutral-900 transition-colors text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <User className="text-accent-cyan" size={20} />
                  <div>
                    <h4 className="font-medium">Edit Profile</h4>
                    <p className="text-sm text-neutral-400">Update your personal information</p>
                  </div>
                </div>
                <span className="text-neutral-500">→</span>
              </button>

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
                    <p className="text-sm text-neutral-400">Become a buyer or officer</p>
                  </div>
                </div>
                <span className="text-neutral-500">→</span>
              </button>
            </div>
          </Card>

          {/* Farm Information */}
          <Card title="Farm Information">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-primary-dark rounded-lg">
                  <p className="text-sm text-neutral-400 mb-1">Farm Size</p>
                  <p className="text-lg font-semibold text-accent-cyan">
                    {farmDetails.farm_size_hectares} hectares
                  </p>
                </div>
                <div className="p-4 bg-primary-dark rounded-lg">
                  <p className="text-sm text-neutral-400 mb-1">Experience</p>
                  <p className="text-lg font-semibold text-accent-cyan">
                    {farmDetails.farming_experience_years} years
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-neutral-300">
                <MapPin size={20} className="text-neutral-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Location</p>
                  <p>{user?.location || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Primary Crops */}
          <Card title="Primary Crops">
            <div className="flex flex-wrap gap-2">
              {farmDetails.primary_crops?.length > 0 ? (
                farmDetails.primary_crops.map((crop, index) => (
                  <span key={index} className="badge-success flex items-center gap-1">
                    <Leaf size={12} />
                    {crop}
                  </span>
                ))
              ) : (
                <p className="text-neutral-500">No crops specified</p>
              )}
            </div>
          </Card>

          {/* Farming Methods & Certifications */}
          <Card title="Methods & Certifications">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-neutral-400 mb-2">Farming Methods</p>
                <div className="flex flex-wrap gap-2">
                  {farmDetails.farming_methods?.length > 0 ? (
                    farmDetails.farming_methods.map((method, index) => (
                      <span key={index} className="badge-info">
                        {method}
                      </span>
                    ))
                  ) : (
                    <p className="text-neutral-500 text-sm">No methods specified</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm text-neutral-400 mb-2">Certifications</p>
                <div className="flex flex-wrap gap-2">
                  {farmDetails.certifications?.length > 0 ? (
                    farmDetails.certifications.map((cert, index) => (
                      <span key={index} className="badge-cyan flex items-center gap-1">
                        <Award size={12} />
                        {cert}
                      </span>
                    ))
                  ) : (
                    <p className="text-neutral-500 text-sm">No certifications</p>
                  )}
                </div>
              </div>
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
        isOpen={activeModal === 'change-password'}
        onClose={() => setActiveModal(null)}
        size="md"
      >
        <ChangePasswordForm
          onClose={() => setActiveModal(null)}
          onSuccess={handleModalSuccess}
        />
      </Modal>

      <AddRoleModal
        isOpen={activeModal === 'add-role'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleModalSuccess}
        currentRoles={user?.roles || []}
      />
    </div>
  );
};

export default FarmerProfilePage;