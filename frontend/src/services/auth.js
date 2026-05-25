import api from './api.js';

export const authService = {
  // Register user
  register: (userData) => {
    return api.post('/auth/register', userData);
  },

  // Register partner
  registerPartner: (partnerData) => {
    return api.post('/auth/register/partner', partnerData);
  },

  // Register enterprise
  registerEnterprise: (enterpriseData) => {
    return api.post('/auth/register/enterprise', enterpriseData);
  },

  // Login
  login: (email, password) => {
    return api.post('/auth/login', { email, password });
  },

  // Get profile
  getProfile: () => {
    return api.get('/auth/profile');
  },

  // Update profile
  updateProfile: (userData) => {
    return api.put('/auth/profile', userData);
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};