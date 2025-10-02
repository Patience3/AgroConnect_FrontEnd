import { useState } from 'react';
import { User, ShoppingBag, Heart, MapPin, Bell } from 'lucide-react';
import { useAuthContext } from '@/context/AuthProvider';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EditProfileForm from '@/components/shared/EditProfileForm';
import ChangePasswordForm from '@/components/shared/ChangePasswordForm';
import AddRoleModal from '@/components/shared/AddRoleModal';
import useNotifications from '@/hooks/useNotifications';
import { formatDate } from '@/utils/helpers';

const BuyerProfilePage = () => {
  const { user } = useAuthContext();
  const { success } = useNotifications();
  const [activeModal, setActiveModal] = useState(null);

  const stats = {
    total_orders: 24,
    total_spent: 1245.50,
    favorite_products: 12,
  };

  const preferences = {
    notifications: {
      order_updates: true,
      promotions: true,
      new_products: false,
      price_drops: true,
    },
    delivery: {
      default_address: '123 Main Street, Accra',
      preferred_time: 'Morning (8AM - 12PM)',
    },
  };

  const handleModalSuccess = (message) => {
    success('Success', message);
    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-neutral-400">Manage your account and preferences</p>
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
              <p className="text-neutral-400 mb-2">{user?.email}</p>
              <span className="badge-success">Verified Buyer</span>

              <div className="mt-6 pt-6 border-t border-neutral-800">
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
                  <ShoppingBag className="text-accent-cyan" size={20} />
                  <span className="text-sm">Total Orders</span>
                </div>
                <span className="font-bold">{stats.total_orders}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-accent-cyan">💰</span>
                  <span className="text-sm">Total Spent</span>
                </div>
                <span className="font-bold price">GHS {stats.total_spent}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="text-accent-cyan" size={20} />
                  <span className="text-sm">Favorites</span>
                </div>
                <span className="font-bold">{stats.favorite_products}</span>
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
                    <p className="text-sm text-neutral-400">Become a farmer or officer</p>
                  </div>
                </div>
                <span className="text-neutral-500">→</span>
              </button>
            </div>
          </Card>

          {/* Delivery Preferences */}
          <Card title="Delivery Preferences">
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                  <MapPin size={16} />
                  Default Delivery Address
                </label>
                <p className="text-neutral-100">{preferences.delivery.default_address}</p>
                <Button size="sm" variant="ghost" className="mt-2">
                  Change Address
                </Button>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <label className="flex items-center gap-2 text-sm text-neutral-400 mb-2">
                  <span>🕐</span>
                  Preferred Delivery Time
                </label>
                <select className="input">
                  <option>Morning (8AM - 12PM)</option>
                  <option>Afternoon (12PM - 5PM)</option>
                  <option>Evening (5PM - 8PM)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card title="Notification Preferences">
            <div className="space-y-3">
              {Object.entries(preferences.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between p-3 bg-primary-dark rounded-lg cursor-pointer hover:bg-neutral-900">
                  <div className="flex items-center gap-3">
                    <Bell className="text-accent-cyan" size={20} />
                    <span className="capitalize">
                      {key.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked={value}
                    className="w-5 h-5 rounded border-neutral-700 bg-primary-light text-accent-cyan focus:ring-accent-teal"
                  />
                </label>
              ))}
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

      <Modal
        isOpen={activeModal === 'add-role'}
        onClose={() => setActiveModal(null)}
        size="md"
      >
        <AddRoleModal
          isOpen={activeModal === 'add-role'}
          onClose={() => setActiveModal(null)}
          onSuccess={handleModalSuccess}
        />
      </Modal>
    </div>
  );
};

export default BuyerProfilePage;