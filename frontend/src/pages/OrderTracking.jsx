import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiMapPin, FiClock, FiUser, FiPhone, FiPackage } from 'react-icons/fi';
import { orderService } from '../services/order';

export default function OrderTracking() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(orderId);
      setOrder(response.order || response.data);
    } catch (error) {
      toast.error('Failed to load order details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => [
    { status: 'pending', label: 'Order Placed', icon: '📦' },
    { status: 'assigned', label: 'Partner Assigned', icon: '🚗' },
    { status: 'in-transit', label: 'In Transit', icon: '🚚' },
    { status: 'delivered', label: 'Delivered', icon: '✅' },
  ];

  const getStatusIndex = () => {
    const steps = getStatusSteps();
    return steps.findIndex((s) => s.status === order?.status);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Order not found</p>
      </div>
    );
  }

  const statusIndex = getStatusIndex();
  const steps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:text-blue-700 flex items-center gap-2 mb-6"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Order Tracking</h1>
          <p className="text-gray-600 mt-2">Order #{order._id?.slice(-6)}</p>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-8">Delivery Status</h2>
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.status} className="flex flex-col items-center flex-1">
                {/* Step Circle */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-3 ${
                    index <= statusIndex
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.icon}
                </div>

                {/* Step Label */}
                <p
                  className={`text-sm font-semibold text-center ${
                    index <= statusIndex ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  {step.label}
                </p>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`absolute h-1 w-20 mt-6 ${
                      index < statusIndex ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    style={{
                      left: `calc(50% + 24px)`,
                      top: '30px',
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Pickup */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <FiMapPin className="text-2xl text-blue-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">Pickup Location</h3>
            </div>
            <p className="text-gray-700">{order.pickupLocation?.address}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>📍 Lat: {order.pickupLocation?.latitude}</p>
              <p>📍 Long: {order.pickupLocation?.longitude}</p>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <FiMapPin className="text-2xl text-green-500 mr-3" />
              <h3 className="text-lg font-bold text-gray-800">Delivery Location</h3>
            </div>
            <p className="text-gray-700">{order.deliveryLocation?.address}</p>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <p>📍 Lat: {order.deliveryLocation?.latitude}</p>
              <p>📍 Long: {order.deliveryLocation?.longitude}</p>
            </div>
          </div>
        </div>

        {/* Package Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiPackage className="text-2xl text-purple-500 mr-3" />
            <h3 className="text-lg font-bold text-gray-800">Package Details</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-800 font-semibold">{order.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Weight</p>
              <p className="text-gray-800 font-semibold">{order.weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dimensions</p>
              <p className="text-gray-800 font-semibold">{order.dimensions}</p>
            </div>
          </div>
        </div>

        {/* Recipient Details */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center mb-4">
            <FiUser className="text-2xl text-orange-500 mr-3" />
            <h3 className="text-lg font-bold text-gray-800">Recipient Details</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-gray-800 font-semibold">{order.recipientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-800 font-semibold">{order.recipientPhone}</p>
            </div>
          </div>
        </div>

        {/* Timeline Events */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FiClock /> Timeline
          </h3>
          <div className="space-y-4">
            {order.timeline && order.timeline.length > 0 ? (
              order.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-800">{event.status}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No timeline events yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
