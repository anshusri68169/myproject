import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderService } from '../services/order';
import { FiPlus, FiMapPin, FiClock } from 'react-icons/fi';

const CustomerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getOrders({ role: 'customer' });
      const allOrders = response.data.data || [];
      setOrders(allOrders);

      // Calculate stats
      const active = allOrders.filter((o) => o.status !== 'delivered').length;
      const completed = allOrders.filter((o) => o.status === 'delivered').length;
      const total = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);

      setStats({
        totalOrders: allOrders.length,
        activeOrders: active,
        completedOrders: completed,
        totalSpent: total,
      });
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_transit: 'bg-orange-100 text-orange-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
            <p className="text-gray-600 mt-1">Manage your deliveries</p>
          </div>
          <Link
            to="/book-order"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-blue-700"
          >
            <FiPlus /> Book New Order
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Active Orders</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.activeOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Completed Orders</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.completedOrders}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 text-sm font-medium">Total Spent</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">₹{stats.totalSpent}</p>
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold">Your Orders</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-6 text-center text-gray-600">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                <p>No orders yet</p>
                <Link to="/book-order" className="text-blue-600 hover:underline mt-2 inline-block">
                  Book your first order
                </Link>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">From</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">To</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{order.orderId}</td>
                      <td className="px-6 py-4 text-sm max-w-xs">
                        <div className="flex items-start gap-2">
                          <FiMapPin className="mt-1 flex-shrink-0" />
                          <span>{order.pickupLocation?.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm max-w-xs">
                        <div className="flex items-start gap-2">
                          <FiMapPin className="mt-1 flex-shrink-0" />
                          <span>{order.deliveryLocation?.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">₹{order.totalAmount}</td>
                      <td className="px-6 py-4">
                        {order.status !== 'delivered' && (
                          <Link
                            to={`/order/${order._id}/track`}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Track
                          </Link>
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

export default CustomerDashboard;