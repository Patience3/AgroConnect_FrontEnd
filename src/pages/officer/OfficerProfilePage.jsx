import { useState } from 'react';
import { Camera, MapPin, Phone, Mail, Award, Calendar, Edit } from 'lucide-react';
import { useAuthContext } from '@/context/AuthProvider';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { formatDate } from '@/utils/helpers';

const OfficerProfilePage = () => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || 'Officer Name',
    email: user?.email || 'officer@example.com',
    phone_number: user?.phone_number || '+233501234567',
    location: 'Accra Region',
    bio: 'Dedicated agricultural extension officer with 8 years of experience supporting farmers in the Greater Accra region.',
    specialization: 'Organic Farming & Pest Management',
    territory: 'Greater Accra Region',
    certifications: ['Certified Agricultural Advisor', 'Organic Farming Specialist', 'IPM Certified'],
    languages: ['English', 'Twi', 'Ga'],
  });

  const stats = {
    farmers_supported: 156,
    total_visits: 89,
    verifications_completed: 124,
    average_rating: 4.7,
    years_experience: 8,
  };

  const achievements = [
    { title: 'Top Performer 2024', icon: '🏆', date: '2024-12-01' },
    { title: '100 Farmers Verified', icon: '✓', date: '2024-09-15' },
    { title: 'Excellence Award', icon: '⭐', date: '2024-06-01' },
    { title: 'Community Impact', icon: '💚', date: '2024-03-10' },
  ];

  const handleSave = () => {
    // Save profile logic
    setIsEditing(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Handle image upload
      console.log('Uploading:', file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Officer Profile</h1>
          <p className="text-neutral-400">Manage your profile and credentials</p>
        </div>
        <Button
          icon={Edit}
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? 'secondary' : 'primary'}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="text-center">
              {/* Profile Image */}
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-accent-teal/20 flex items-center justify-center mx-auto">
                  <span className="text-5xl">👨‍🌾</span>
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
              <p className="text-neutral-400 mb-4">{profileData.specialization}</p>
              
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="badge-success">Verified Officer</span>
                <span className="badge-cyan">{stats.years_experience} years</span>
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
            {isEditing ? (
              <form className="space-y-4">
                <Input
                  label="Full Name"
                  value={profileData.full_name}
                  onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  icon={Mail}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={profileData.phone_number}
                  onChange={(e) => setProfileData({ ...profileData, phone_number: e.target.value })}
                  icon={Phone}
                />
                <Input
                  label="Location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  icon={MapPin}
                />
                <Button onClick={handleSave} fullWidth>
                  Save Changes
                </Button>
              </form>
            ) : (
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
                  <span>{profileData.location}</span>
                </div>
              </div>
            )}
          </Card>

          {/* Professional Details */}
          <Card title="Professional Details">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  label="Specialization"
                  value={profileData.specialization}
                  onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                />
                <Input
                  label="Territory"
                  value={profileData.territory}
                  onChange={(e) => setProfileData({ ...profileData, territory: e.target.value })}
                />
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    rows="4"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Territory</p>
                  <p className="text-neutral-300">{profileData.territory}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Specialization</p>
                  <p className="text-neutral-300">{profileData.specialization}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400 mb-1">Bio</p>
                  <p className="text-neutral-300">{profileData.bio}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Certifications */}
          <Card title="Certifications">
            <div className="flex flex-wrap gap-2">
              {profileData.certifications.map((cert, idx) => (
                <span key={idx} className="badge-success flex items-center gap-1">
                  <Award size={14} />
                  {cert}
                </span>
              ))}
            </div>
          </Card>

          {/* Languages */}
          <Card title="Languages">
            <div className="flex flex-wrap gap-2">
              {profileData.languages.map((lang, idx) => (
                <span key={idx} className="badge-cyan">
                  {lang}
                </span>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OfficerProfilePage;