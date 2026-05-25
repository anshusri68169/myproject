import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderService } from '../services/order';
import { FiMapPin, FiPackage } from 'react-icons/fi';

const BookOrder = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    pickupCity: 'Lucknow',
    pickupZip: '',
    deliveryAddress: '',
    deliveryCity: 'Lucknow',
    deliveryZip: '',
    itemName: '',
    itemWeight: '',
    itemQuantity: '1',
    itemDescription: '',
    paymentMethod: 'wallet', // wallet or cash
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateCharge = () => {
    const baseCharge = 50; // Base charge
    const weightCharge = (parseFloat(formData.itemWeight) || 0) * 5; // ₹5 per kg
    return baseCharge + weightCharge;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.pickupAddress || !formData.deliveryAddress || !formData.itemName) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const totalAmount = calculateCharge();
      const response = await orderService.createOrder({
        pickupLocation: {
          address: `${formData.pickupAddress}, ${formData.pickupCity}, ${formData.pickupZip}`,
          coordinates: { latitude: 26.8467, longitude: 80.9462 }, // Sample coordinates
        },
        deliveryLocation: {
          address: `${formData.deliveryAddress}, ${formData.deliveryCity}, ${formData.deliveryZip}`,
          coordinates: { latitude: 26.8500, longitude: 80.9500 },
        },
        items: [
          {
            name: formData.itemName,
            weight: parseFloat(formData.itemWeight),
            quantity: parseInt(formData.itemQuantity),
            price: totalAmount,
            description: formData.itemDescription,
          },
        ],
        totalAmount,
        paymentMethod: formData.paymentMethod,
      });

      toast.success('Order placed successfully!');
      navigate('/customer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Book an Order</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
              {/* Pickup Details */}
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FiMapPin /> Pickup Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Pickup Address *</label>
                    <input
                      type="text"
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter pickup address"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <select
                        name="pickupCity"
                        value={formData.pickupCity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="Lucknow">Lucknow</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="pickupZip"
                        value={formData.pickupZip}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="226001"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FiMapPin /> Delivery Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Delivery Address *</label>
                    <input
                      type="text"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Enter delivery address"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <select
                        name="deliveryCity"
                        value={formData.deliveryCity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      >
                        <option value="Lucknow">Lucknow</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Zip Code</label>
                      <input
                        type="text"
                        name="deliveryZip"
                        value={formData.deliveryZip}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="226002"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="border-b pb-6">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FiPackage /> Package Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Item Name *</label>
                    <input
                      type="text"
                      name="itemName"
                      value={formData.itemName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="e.g., Electronics, Documents"
                      required
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Weight (kg) *</label>
                      <input
                        type="number"
                        step="0.1"
                        name="itemWeight"
                        value={formData.itemWeight}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="2.5"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity</label>
                      <input
                        type="number"
                        name="itemQuantity"
                        value={formData.itemQuantity}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                        placeholder="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Charge</label>
                      <input
                        type="text"
                        value={`₹${calculateCharge()}`}
                        disabled
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 font-semibold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      name="itemDescription"
                      value={formData.itemDescription}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Describe the item"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={formData.paymentMethod === 'wallet'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <span className="text-gray-700">Wallet (Recommended)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                      className="mr-3"
                    />
                    <span className="text-gray-700">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Booking...' : `Book Order - ₹${calculateCharge()}`}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Base Charge</p>
                  <p className="text-lg font-semibold">₹50</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Weight Charge</p>
                  <p className="text-lg font-semibold">₹{(parseFloat(formData.itemWeight) || 0) * 5}</p>
                </div>
                <div className="border-b pb-4">
                  <p className="text-gray-600 text-sm">Total Charge</p>
                  <p className="text-2xl font-bold text-blue-600">₹{calculateCharge()}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">💡 Pricing Info:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Base charge: ₹50</li>
                    <li>• Weight charge: ₹5/kg</li>
                    <li>• Same-day delivery</li>
                    <li>• Free tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookOrder;