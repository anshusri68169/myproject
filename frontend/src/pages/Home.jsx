import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiTruck, FiPackage, FiMapPin, FiClock } from 'react-icons/fi';
import { useState, useEffect } from 'react';

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [dashboardLink, setDashboardLink] = useState('');

  useEffect(() => {
    // Debug: Check what's in Redux and localStorage
    console.log('Redux Auth State:', { isAuthenticated, user });
    console.log('LocalStorage Token:', localStorage.getItem('token'));
    console.log('LocalStorage User:', localStorage.getItem('user'));

    // Determine dashboard link based on user role
    if (user?.role) {
      const links = {
        customer: '/customer/dashboard',
        partner: '/partner/dashboard',
        enterprise: '/enterprise/dashboard',
        admin: '/admin/dashboard',
      };
      setDashboardLink(links[user.role] || '/customer/dashboard');
    }
  }, [user, isAuthenticated]);

  const handleDashboardClick = (e) => {
    e.preventDefault();
    console.log('Dashboard button clicked');
    console.log('Current Auth State:', { isAuthenticated, user });
    console.log('Navigating to:', dashboardLink);

    if (!dashboardLink) {
      console.error('No dashboard link available');
      return;
    }

    navigate(dashboardLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">🚚 QuickLift</h1>
          <p className="text-2xl text-gray-700 mb-8">Last Mile Delivery Platform for Lucknow</p>
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            Fast, reliable, and affordable delivery service for customers, partners, and enterprises
          </p>

          {!isAuthenticated ? (
            <div className="flex gap-4 justify-center flex-wrap">
              <Link
                to="/login"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-gray-50 transition"
              >
                Register as Customer
              </Link>
              <Link
                to="/register/partner"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Join as Partner
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-xl text-gray-700 mb-6">
                Welcome, {user?.name}! (Role: {user?.role})
              </p>
              <button
                onClick={handleDashboardClick}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose QuickLift?</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <FiTruck className="mx-auto text-4xl text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Same-day delivery available in Lucknow</p>
            </div>
            <div className="text-center">
              <FiPackage className="mx-auto text-4xl text-green-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Safe Handling</h3>
              <p className="text-gray-600">Your packages are handled with care</p>
            </div>
            <div className="text-center">
              <FiMapPin className="mx-auto text-4xl text-red-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track your order live on the map</p>
            </div>
            <div className="text-center">
              <FiClock className="mx-auto text-4xl text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-gray-600">Our team is here to help you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Role</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Customer */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">👤 Customer</h3>
              <p className="text-gray-600 mb-6">
                Book deliveries, track orders, and manage your wallet
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ Easy order booking</li>
                <li>✓ Real-time tracking</li>
                <li>✓ Secure wallet</li>
                <li>✓ Order history</li>
              </ul>
              <Link
                to="/register"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                Register
              </Link>
            </div>

            {/* Partner */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">🚗 Partner</h3>
              <p className="text-gray-600 mb-6">
                Earn by delivering orders with your own vehicle
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ Accept/reject orders</li>
                <li>✓ Earn commissions</li>
                <li>✓ Build reputation</li>
                <li>✓ Withdrawal system</li>
              </ul>
              <Link
                to="/register/partner"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
              >
                Apply Now
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-4">🏢 Enterprise</h3>
              <p className="text-gray-600 mb-6">
                Bulk delivery solutions for your business
              </p>
              <ul className="text-sm text-gray-600 space-y-2 mb-6">
                <li>✓ Bulk orders</li>
                <li>✓ Special pricing</li>
                <li>✓ Analytics</li>
                <li>✓ API access</li>
              </ul>
              <Link
                to="/register/enterprise"
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
