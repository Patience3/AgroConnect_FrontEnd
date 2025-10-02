// User Types
export const USER_ROLES = {
  FARMER: 'farmer',
  BUYER: 'buyer',
  OFFICER: 'officer',
};

export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

// Product Types
export const PRODUCT_CATEGORIES = {
  VEGETABLES: 'vegetables',
  FRUITS: 'fruits',
  GRAINS: 'grains',
  LEGUMES: 'legumes',
  TUBERS: 'tubers',
  LIVESTOCK: 'livestock',
  DAIRY: 'dairy',
  POULTRY: 'poultry',
};

export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  OUT_OF_STOCK: 'out_of_stock',
  DISCONTINUED: 'discontinued',
};

export const QUALITY_GRADES = {
  PREMIUM: 'premium',
  GRADE_A: 'grade_a',
  GRADE_B: 'grade_b',
  STANDARD: 'standard',
};

export const UNITS_OF_MEASURE = {
  KG: 'kg',
  GRAM: 'gram',
  POUND: 'pound',
  LITER: 'liter',
  PIECE: 'piece',
  DOZEN: 'dozen',
  BUNCH: 'bunch',
  BAG: 'bag',
};

// Order Types
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  IN_TRANSIT: 'in_transit',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

export const PAYMENT_METHODS = {
  MOBILE_MONEY: 'mobile_money',
  CARD: 'card',
  CASH_ON_DELIVERY: 'cash_on_delivery',
};

export const ESCROW_STATUS = {
  HELD: 'held',
  RELEASED: 'released',
  REFUNDED: 'refunded',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  MESSAGE: 'message',
  SYSTEM: 'system',
  ALERT: 'alert',
};

export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Visit Request Types
export const VISIT_STATUS = {
  REQUESTED: 'requested',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export const VISIT_TYPES = {
  VERIFICATION: 'verification',
  ADVISORY: 'advisory',
  INSPECTION: 'inspection',
  TRAINING: 'training',
  EMERGENCY: 'emergency',
};

// Form Validation Patterns
export const VALIDATION_PATTERNS = {
  PHONE: /^\+?[1-9]\d{1,14}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  POSTAL_CODE: /^\d{5}(-\d{4})?$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'Resource not found.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PRODUCT_CREATED: 'Product created successfully!',
  PRODUCT_UPDATED: 'Product updated successfully!',
  ORDER_PLACED: 'Order placed successfully!',
  ORDER_UPDATED: 'Order status updated!',
  PAYMENT_SUCCESS: 'Payment processed successfully!',
};