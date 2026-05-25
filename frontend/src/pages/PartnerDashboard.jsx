import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { orderService } from '../services/order';
import { FiCheck, FiX } from 'react-icons/fi';

const PartnerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // pending, accepted, completed
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    totalEarnings: 0,
    rating: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders({ role: 'partner' });
      const allOrders = response.data.data || [];
      setOrders(allOrders);

      const active = allOrders.filter((o) => o.status === 'in_transit').length;
      const completed = allOrders.filter((o) => o.status === 'delivered').length;
      const earnings = user?.earnings?.available || 0;

      setStats({
        activeOrders: active,
        completedOrders: completed,
        totalEarnings: earnings,
        rating: user?.rating || 0,
      });
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    try {
      await orderService.acceptOrder(orderId);
      toast.success('Order accepted!');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept order');
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await orderService.completeOrder(orderId);
      toast.success('Order completed!');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to complete order');
    }
  };

  const getFilteredOrders = () => {
    const statusMap = {
      pending: 'pending',
      accepted: 'in_transit',
      completed: 'delivered',
    };
    return orders.filter((o) => o.status === statusMap[activeTab]);
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_transit: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-1">Manage your deliveries and earnings</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Active Orders</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Completed Orders</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Available Balance</p>
            <p className="text-3xl font-bold text-green-600 mt-2">₹{stats.totalEarnings}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Rating</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.rating}⭐</p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex gap-4">
              {['pending', 'accepted', 'completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium rounded-lg capitalize ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab} Orders
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-600">Loading orders...</div>
            ) : getFilteredOrders().length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                No {activeTab} orders
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Pickup Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Delivery Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Charge</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredOrders().map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{order.orderId}</td>
                      <td className="px-6 py-4 text-sm">{order.pickupLocation?.address}</td>
                      <td className="px-6 py-4 text-sm">{order.deliveryLocation?.address}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">₹{order.totalAmount}</td>
                      <td className="px-6 py-4 space-x-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => handleAcceptOrder(order._id)}
                            className="inline-flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            <FiCheck /> Accept
                          </button>
                        )}
                        {order.status === 'in_transit' && (
                          <button
                            onClick={() => handleCompleteOrder(order._id)}
                            className="inline-flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                          >
                            <FiCheck /> Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;