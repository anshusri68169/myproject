import api from './api.js';

export const orderService = {
  // Create order
  createOrder: (orderData) => {
    return api.post('/orders', orderData);
  },

  // Get all orders (customer/partner/enterprise)
  getOrders: (params) => {
    return api.get('/orders', { params });
  },

  // Get order by ID
  getOrder: (orderId) => {
    return api.get(`/orders/${orderId}`);
  },

  // Update order status (partner)
  updateOrderStatus: (orderId, status) => {
    return api.put(`/orders/${orderId}/status`, { status });
  },

  // Accept order (partner)
  acceptOrder: (orderId) => {
    return api.post(`/orders/${orderId}/accept`);
  },

  // Complete order (partner)
  completeOrder: (orderId) => {
    return api.post(`/orders/${orderId}/complete`);
  },

  // Get analytics
  getAnalytics: () => {
    return api.get('/orders/analytics');
  },
};