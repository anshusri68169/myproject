export const USER_ROLES = {
  CUSTOMER: 'customer',
  PARTNER: 'partner',
  ENTERPRISE: 'enterprise',
  ADMIN: 'admin',
};

export const VEHICLE_TYPES = {
  BIKE: 'bike',
  SCOOTER: 'scooter',
  AUTO: 'auto',
};

export const VEHICLE_CAPACITIES = {
  bike: 5,
  scooter: 10,
  auto: 50,
};

export const ORDER_STATUS = {
  PENDING_ASSIGNMENT: 'PENDING_ASSIGNMENT',
  ASSIGNED: 'ASSIGNED',
  PICKED_UP: 'PICKED_UP',
  IN_PROGRESS: 'IN_PROGRESS',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
};

export const PAYMENT_METHODS = {
  WALLET: 'wallet',
  CASH: 'cash',
  CARD: 'card',
  UPI: 'upi',
};

export const PARTNER_STATUS = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SUSPENDED: 'SUSPENDED',
};

export const PARTNER_AVAILABILITY = {
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
  ON_BREAK: 'ON_BREAK',
};

export const SUPPORT_CATEGORIES = {
  TECHNICAL: 'TECHNICAL',
  PAYMENT: 'PAYMENT',
  DELIVERY: 'DELIVERY',
  ACCOUNT: 'ACCOUNT',
  GENERAL: 'GENERAL',
  COMPLAINT: 'COMPLAINT',
};

export const PRIORITY_LEVELS = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
};

export const API_RATE_LIMITS = {
  STANDARD: 1000, // requests per hour
  PREMIUM: 10000,
};

export const VERIFICATION_METHODS = {
  PAN: 'PAN',
  AADHAR: 'AADHAR',
};

export const COMMISSION_PERCENTAGE = 15;
export const TAX_PERCENTAGE = 5;

export const SERVICE_AREA_RADIUS = 20; // km

export const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes
export const TOKEN_EXPIRY_TIME = 15 * 60; // 15 minutes
export const REFRESH_TOKEN_EXPIRY_TIME = 7 * 24 * 60 * 60; // 7 days
