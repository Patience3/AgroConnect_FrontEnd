import { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Phone,
  MapPin,
  Calendar,
  Award,
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { formatDate } from '@/utils/helpers';
import clsx from 'clsx';

const FarmersManagement = () => {
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  useEffect(() => {
    loadFarmers();
  }, [filterStatus]);

  const loadFarmers = async () => {
    try {
      setIsLoading(true);
      // Mock data
      const mockFarmers = [
        {
          id: '1',
          full_name: 'John Kwame',
          phone_number: '+233501234567',
          farm_name: 'Green Valley Farm',
          farm_size: 5.5,
          primary_crops: ['Tomatoes', 'Lettuce'],
          experience_years: 8,
          is_verified: true,
          location: 'Accra Central',
          joined_date: '2024-01-15',
          total_products: 12,
          total_orders: 45,
        },
        {
          id: '2',
          full_name: 'Mary Mensah',
          phone_number: '+233507654321',
          farm_name: 'Organic Harvest',
          farm_size: 3.2,
          primary_crops: ['Spinach', 'Cabbage', 'Carrots'],
          experience_years: 5,
          is_verified: false,
          location: 'Kumasi',
          joined_date: '2024-02-20',
          total_products: 8,
          total_orders: 23,
        },
        {
          id: '3',
          full_name: 'David Osei',
          phone_number: '+233509876543',
          farm_name: 'Fresh Fields',
          farm_size: 7.8,
          primary_crops: ['Maize', 'Beans'],
          experience_years: 12,
          is_verified: false,
          location: 'Takoradi',
          joined_date: '2024-03-10',
          total_products: 6,
          total_orders: 15,
        },
      ];
      setFarmers(mockFarmers);
    } catch (error) {
      console.error('Error loading farmers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (farmerId) => {
    try {
      // Verify farmer logic
      console.log('Verifying farmer:', farmerId);
      loadFarmers();
    } catch (error) {
      console.error('Error verifying farmer:', error);
    }
  };

  const filteredFarmers = farmers
    .filter((farmer) => {
      if (filterStatus === 'verified') return farmer.is_verified;
      if (filterStatus === 'unverified') return !farmer.is_verified;
      return true;
    })
    .filter((farmer) =>
      farmer.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.farm_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const FarmerCard = ({ farmer }) => (
    <Card hover>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-accent-teal/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">👨‍🌾</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{farmer.full_name}</h3>
              <p className="text-sm text-neutral-400 mb-2">{farmer.farm_name}</p>
              <div className="flex items-center gap-2">
                {farmer.is_verified ? (
                  <span className="badge-success flex items-center gap-1">
                    <CheckCircle size={14} />
                    Verified
                  </span>
                ) : (
                  <span className="badge-warning flex items-center gap-1">
                    <XCircle size={14} />
                    Unverified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Farm Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-primary-dark rounded-lg">
          <div>
            <p className="text-xs text-neutral-500 mb-1">Farm Size</p>
            <p className="font-semibold">{farmer.farm_size} hectares</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Experience</p>
            <p className="font-semibold">{farmer.experience_years} years</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Products</p>
            <p className="font-semibold">{farmer.total_products}</p>
          </div>
          <div>
            <p className="text-xs text-neutral-500 mb-1">Orders</p>
            <p className="font-semibold">{farmer.total_orders}</p>
          </div>
        </div>

        {/* Crops */}
        <div>
          <p className="text-sm text-neutral-400 mb-2">Primary Crops</p>
          <div className="flex flex-wrap gap-2">
            {farmer.primary_crops.map((crop, idx) => (
              <span key={idx} className="badge-cyan text-xs">
                {crop}
              </span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2 pt-4 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Phone size={14} />
            <span>{farmer.phone_number}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <MapPin size={14} />
            <span>{farmer.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <Calendar size={14} />
            <span>Joined {formatDate(farmer.joined_date)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={Eye}
            onClick={() => setSelectedFarmer(farmer)}
            fullWidth
          >
            View Profile
          </Button>
          {!farmer.is_verified && (
            <Button
              size="sm"
              icon={Award}
              onClick={() => handleVerify(farmer.id)}
              fullWidth
            >
              Verify
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Farmers Management</h1>
        <p className="text-neutral-400">Manage and verify farmers in your area</p>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Search by farmer or farm name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={Search}
          />
        </div>
        <div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input"
          >
            <option value="all">All Farmers</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent-cyan">{farmers.length}</p>
            <p className="text-sm text-neutral-400 mt-1">Total Farmers</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {farmers.filter((f) => f.is_verified).length}
            </p>
            <p className="text-sm text-neutral-400 mt-1">Verified</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">
              {farmers.filter((f) => !f.is_verified).length}
            </p>
            <p className="text-sm text-neutral-400 mt-1">Pending</p>
          </div>
        </Card>
      </div>

      {/* Farmers List */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-64 bg-neutral-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredFarmers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFarmers.map((farmer) => (
            <FarmerCard key={farmer.id} farmer={farmer} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-neutral-400 mb-4">No farmers found</p>
          <Button onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
            Clear Filters
          </Button>
        </Card>
      )}

      {/* Farmer Detail Modal */}
      {selectedFarmer && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedFarmer(null)}
        >
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 rounded-full bg-accent-teal/20 flex items-center justify-center">
                      <span className="text-4xl">👨‍🌾</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">
                        {selectedFarmer.full_name}
                      </h2>
                      <p className="text-neutral-400 mb-2">
                        {selectedFarmer.farm_name}
                      </p>
                      {selectedFarmer.is_verified ? (
                        <span className="badge-success">Verified Farmer</span>
                      ) : (
                        <span className="badge-warning">Pending Verification</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="p-4 bg-primary-dark rounded-lg space-y-2">
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-neutral-500" />
                    <span>{selectedFarmer.phone_number}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-neutral-500" />
                    <span>{selectedFarmer.location}</span>
                  </div>
                </div>

                {/* Farm Details */}
                <div>
                  <h3 className="font-semibold mb-3">Farm Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-primary-dark rounded-lg">
                      <p className="text-xs text-neutral-500 mb-1">Farm Size</p>
                      <p className="font-semibold">
                        {selectedFarmer.farm_size} hectares
                      </p>
                    </div>
                    <div className="p-3 bg-primary-dark rounded-lg">
                      <p className="text-xs text-neutral-500 mb-1">Experience</p>
                      <p className="font-semibold">
                        {selectedFarmer.experience_years} years
                      </p>
                    </div>
                    <div className="p-3 bg-primary-dark rounded-lg">
                      <p className="text-xs text-neutral-500 mb-1">Products</p>
                      <p className="font-semibold">{selectedFarmer.total_products}</p>
                    </div>
                    <div className="p-3 bg-primary-dark rounded-lg">
                      <p className="text-xs text-neutral-500 mb-1">Orders</p>
                      <p className="font-semibold">{selectedFarmer.total_orders}</p>
                    </div>
                  </div>
                </div>

                {/* Primary Crops */}
                <div>
                  <h3 className="font-semibold mb-3">Primary Crops</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFarmer.primary_crops.map((crop, idx) => (
                      <span key={idx} className="badge-cyan">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t border-neutral-800">
                  {!selectedFarmer.is_verified && (
                    <Button
                      icon={Award}
                      onClick={() => {
                        handleVerify(selectedFarmer.id);
                        setSelectedFarmer(null);
                      }}
                      fullWidth
                    >
                      Verify Farmer
                    </Button>
                  )}
                  <Button
                    variant="secondary"
                    onClick={() => setSelectedFarmer(null)}
                    fullWidth
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmersManagement;