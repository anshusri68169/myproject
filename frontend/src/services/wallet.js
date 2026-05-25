import api from './api.js';

export const walletService = {
  // Get wallet
  getWallet: () => {
    return api.get('/wallet');
  },

  // Add money to wallet
  addMoney: (amount) => {
    return api.post('/wallet/add-money', { amount });
  },

  // Get transactions
  getTransactions: (params) => {
    return api.get('/wallet/transactions', { params });
  },
};