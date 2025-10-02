// src/config/development.js

// Toggle development mode - SET TO false FOR PRODUCTION
export const DEVELOPMENT_MODE = true;

// Mock user data for different roles
export const MOCK_USERS = {
  buyer: {
    id: 'mock-buyer-1',
    full_name: 'John Buyer',
    email: 'buyer@test.com',
    phone_number: '+233501234567',
    roles: ['buyer'],
    profile_image_url: null,
    location: 'Accra, Ghana',
    is_verified: true,
    created_at: '2024-01-15T10:00:00Z',
  },
  farmer: {
    id: 'mock-farmer-1',
    full_name: 'Mary Farmer',
    email: 'farmer@test.com',
    phone_number: '+233507654321',
    roles: ['farmer'],
    profile_image_url: null,
    location: 'Kumasi, Ghana',
    farm_name: 'Green Valley Farm',
    farm_size_hectares: 5.5,
    primary_crops: ['Tomatoes', 'Lettuce', 'Spinach'],
    farming_experience_years: 8,
    farming_methods: ['Organic', 'Traditional'],
    certifications: ['Organic Certified'],
    is_verified_farmer: true,
    created_at: '2024-01-10T10:00:00Z',
  },
  officer: {
    id: 'mock-officer-1',
    full_name: 'David Officer',
    email: 'officer@test.com',
    phone_number: '+233509876543',
    roles: ['officer'],
    profile_image_url: null,
    location: 'Accra Region',
    specialization: 'Organic Farming & Pest Management',
    territory: 'Greater Accra Region',
    certifications: ['Certified Agricultural Advisor', 'Organic Farming Specialist'],
    languages: ['English', 'Twi', 'Ga'],
    is_verified: true,
    created_at: '2024-01-05T10:00:00Z',
  },
  // Multi-role user
  multiRole: {
    id: 'mock-multi-1',
    full_name: 'Sarah Multi',
    email: 'multi@test.com',
    phone_number: '+233502345678',
    roles: ['buyer', 'farmer', 'officer'],
    profile_image_url: null,
    location: 'Takoradi, Ghana',
    farm_name: 'Multi Farm',
    farm_size_hectares: 3.2,
    primary_crops: ['Maize', 'Beans'],
    farming_experience_years: 5,
    is_verified_farmer: true,
    is_verified: true,
    created_at: '2024-02-01T10:00:00Z',
  },
};

// Default mock user - Change this to test different roles
// Options: 'buyer', 'farmer', 'officer', 'multiRole'
export const DEFAULT_MOCK_USER = 'multiRole';

// Mock token
export const MOCK_TOKEN = 'mock-jwt-token-for-development';

// Get the mock user for development
export const getMockUser = (roleKey = DEFAULT_MOCK_USER) => {
  return MOCK_USERS[roleKey] || MOCK_USERS.buyer;
};

// Initialize development mode
export const initDevMode = () => {
  if (!DEVELOPMENT_MODE) return false;

  const user = getMockUser();
  
  // Set mock data in localStorage
  localStorage.setItem('auth_token', MOCK_TOKEN);
  localStorage.setItem('user_data', JSON.stringify(user));
  localStorage.setItem('current_role', user.roles[0]);

  console.log('🔧 Development Mode Active');
  console.log('👤 Mock User:', user.full_name);
  console.log('🎭 Roles:', user.roles.join(', '));
  console.log('💡 To change user, modify DEFAULT_MOCK_USER in src/config/development.js');

  return true;
};

// Mock API responses
export const MOCK_API_RESPONSES = {
  // Products
  products: [
    {
      id: 'prod-1',
      name: 'Fresh Tomatoes',
      description: 'Organic vine-ripened tomatoes',
      category: 'vegetables',
      price_per_unit: 5.50,
      unit_of_measure: 'kg',
      quantity_available: 100,
      minimum_order_quantity: 5,
      is_organic: true,
      quality_grade: 'premium',
      harvest_date: '2025-09-25',
      expiry_date: '2025-10-10',
      status: 'available',
      images: [],
      farmer_id: 'mock-farmer-1',
      location: 'Kumasi, Ghana',
      created_at: '2025-09-20T10:00:00Z',
    },
    {
      id: 'prod-2',
      name: 'Organic Spinach',
      description: 'Fresh organic spinach leaves',
      category: 'vegetables',
      price_per_unit: 3.00,
      unit_of_measure: 'kg',
      quantity_available: 50,
      minimum_order_quantity: 2,
      is_organic: true,
      quality_grade: 'grade_a',
      harvest_date: '2025-09-28',
      status: 'available',
      images: [],
      farmer_id: 'mock-farmer-1',
      location: 'Kumasi, Ghana',
      created_at: '2025-09-22T10:00:00Z',
    },
    {
      id: 'prod-3',
      name: 'Sweet Corn',
      description: 'Fresh sweet corn from local farm',
      category: 'vegetables',
      price_per_unit: 2.50,
      unit_of_measure: 'kg',
      quantity_available: 8,
      minimum_order_quantity: 5,
      is_organic: false,
      quality_grade: 'standard',
      harvest_date: '2025-09-26',
      status: 'available',
      images: [],
      farmer_id: 'mock-farmer-2',
      location: 'Accra, Ghana',
      created_at: '2025-09-21T10:00:00Z',
    },
  ],

  // Orders
  orders: [
    {
      id: 'order-1',
      order_number: 'ORD-2025-00456',
      buyer_id: 'mock-buyer-1',
      buyer_name: 'John Buyer',
      farmer_id: 'mock-farmer-1',
      farmer_name: 'Mary Farmer',
      status: 'pending',
      payment_status: 'pending',
      total_amount: 125.50,
      delivery_address: '123 Main St, Accra',
      delivery_date: '2025-10-05',
      special_instructions: 'Please call on arrival',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      items: [
        {
          product_id: 'prod-1',
          product_name: 'Fresh Tomatoes',
          quantity: 10,
          unit_price: 5.50,
          unit_of_measure: 'kg',
          line_total: 55.00,
        },
        {
          product_id: 'prod-2',
          product_name: 'Organic Spinach',
          quantity: 20,
          unit_price: 3.00,
          unit_of_measure: 'kg',
          line_total: 60.00,
        },
      ],
    },
    {
      id: 'order-2',
      order_number: 'ORD-2025-00432',
      buyer_id: 'mock-buyer-1',
      buyer_name: 'John Buyer',
      farmer_id: 'mock-farmer-1',
      farmer_name: 'Mary Farmer',
      status: 'delivered',
      payment_status: 'paid',
      total_amount: 89.00,
      delivery_address: '123 Main St, Accra',
      delivery_date: '2025-09-28',
      created_at: new Date(Date.now() - 86400000).toISOString(),
      items: [
        {
          product_id: 'prod-2',
          product_name: 'Organic Spinach',
          quantity: 25,
          unit_price: 3.00,
          unit_of_measure: 'kg',
          line_total: 75.00,
        },
      ],
    },
  ],

  // Visit requests (for officers)
  visits: [
    {
      id: 'visit-1',
      farmer_id: 'mock-farmer-1',
      farmer_name: 'Mary Farmer',
      farm_name: 'Green Valley Farm',
      officer_id: 'mock-officer-1',
      officer_name: 'David Officer',
      visit_type: 'verification',
      status: 'scheduled',
      preferred_date: '2025-10-10',
      preferred_time: 'morning',
      purpose: 'Initial farm verification',
      location: 'Kumasi, Ghana',
      special_requirements: '',
      requested_at: new Date(Date.now() - 172800000).toISOString(),
    },
  ],

  // Farmers (for officers)
  farmers: [
    {
      id: 'mock-farmer-1',
      full_name: 'Mary Farmer',
      phone_number: '+233507654321',
      farm_name: 'Green Valley Farm',
      farm_size: 5.5,
      primary_crops: ['Tomatoes', 'Lettuce', 'Spinach'],
      experience_years: 8,
      is_verified: true,
      location: 'Kumasi, Ghana',
      joined_date: '2024-01-10',
      total_products: 12,
      total_orders: 45,
    },
    {
      id: 'mock-farmer-2',
      full_name: 'James Farmer',
      phone_number: '+233508765432',
      farm_name: 'Organic Harvest',
      farm_size: 3.2,
      primary_crops: ['Spinach', 'Cabbage', 'Carrots'],
      experience_years: 5,
      is_verified: false,
      location: 'Accra, Ghana',
      joined_date: '2024-02-20',
      total_products: 8,
      total_orders: 23,
    },
  ],
};

// Check if we should use mock data
export const shouldUseMockData = () => {
  return DEVELOPMENT_MODE && import.meta.env.MODE === 'development';
};