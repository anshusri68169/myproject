import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'customer':
        return '/customer/dashboard';
      case 'partner':
        return '/partner/dashboard';
      case 'enterprise':
        return '/enterprise/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/';
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center gap-2">
            🚚 QuickLift
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Login
                </Link>
                <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardLink()}
                  className="hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Dashboard
                </Link>
                {user?.role === 'customer' && (
                  <Link to="/book-order" className="hover:bg-blue-700 px-3 py-2 rounded">
                    Book Order
                  </Link>
                )}
                <Link to="/wallet" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Wallet
                </Link>
                <Link to="/support" className="hover:bg-blue-700 px-3 py-2 rounded">
                  Support
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:bg-blue-700 px-3 py-2 rounded"
                >
                  <FiLogOut /> Logout
                </button>
                <span className="text-sm">{user?.name}</span>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="block hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={getDashboardLink()}
                  className="block hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Dashboard
                </Link>
                {user?.role === 'customer' && (
                  <Link
                    to="/book-order"
                    className="block hover:bg-blue-700 px-3 py-2 rounded"
                  >
                    Book Order
                  </Link>
                )}
                <Link
                  to="/wallet"
                  className="block hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Wallet
                </Link>
                <Link
                  to="/support"
                  className="block hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Support
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:bg-blue-700 px-3 py-2 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;