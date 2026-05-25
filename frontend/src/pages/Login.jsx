import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { login as loginAction } from '../store/slices/authSlice';
import { authService } from '../services/auth';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: 'customer@test.com',
    password: 'Test@123',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!credentials.email || !credentials.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(credentials.email, credentials.password);
      const { token, user } = response.data.data;

      // Save token and user to localStorage and Redux
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch(loginAction({ user, token }));

      toast.success('Login successful!');

      // Redirect based on role
      switch (user.role) {
        case 'customer':
          navigate('/customer/dashboard');
          break;
        case 'partner':
          navigate('/partner/dashboard');
          break;
        case 'enterprise':
          navigate('/enterprise/dashboard');
          break;
        case 'admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const setTestCredentials = (role) => {
    const creds = {
      customer: { email: 'customer@test.com', password: 'Test@12345' },
      partner: { email: 'partner@test.com', password: 'Test@12345' },
      enterprise: { email: 'enterprise@test.com', password: 'Test@12345' },
      admin: { email: 'admin@test.com', password: 'Test@12345' },
    };
    setCredentials(creds[role]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Test Credentials */}
        <div className="mt-6 border-t pt-4">
          <p className="text-sm font-medium mb-3 text-center text-gray-600">Test Accounts:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setTestCredentials('customer')}
              className="w-full bg-blue-50 border border-blue-200 text-blue-600 py-2 rounded hover:bg-blue-100 text-sm font-medium"
            >
              👤 Customer Account
            </button>
            <button
              type="button"
              onClick={() => setTestCredentials('partner')}
              className="w-full bg-green-50 border border-green-200 text-green-600 py-2 rounded hover:bg-green-100 text-sm font-medium"
            >
              🚗 Partner Account
            </button>
            <button
              type="button"
              onClick={() => setTestCredentials('enterprise')}
              className="w-full bg-purple-50 border border-purple-200 text-purple-600 py-2 rounded hover:bg-purple-100 text-sm font-medium"
            >
              🏢 Enterprise Account
            </button>
            <button
              type="button"
              onClick={() => setTestCredentials('admin')}
              className="w-full bg-red-50 border border-red-200 text-red-600 py-2 rounded hover:bg-red-100 text-sm font-medium"
            >
              ⚙️ Admin Account
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            All test accounts use password: <strong>Test@123</strong>
          </p>
        </div>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;