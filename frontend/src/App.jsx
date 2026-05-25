import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PartnerRegister from './pages/PartnerRegister';
import EnterpriseRegister from './pages/EnterpriseRegister';
import PartnerDashboard from './pages/PartnerDashboard';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookOrder from './pages/BookOrder';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

function App() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/partner" element={<PartnerRegister />} />
        <Route path="/register/enterprise" element={<EnterpriseRegister />} />

        {/* Protected Routes - Partner */}
        <Route
          path="/partner/dashboard"
          element={
            <ProtectedRoute requiredRole="partner">
              <PartnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Enterprise */}
        <Route
          path="/enterprise/dashboard"
          element={
            <ProtectedRoute requiredRole="enterprise">
              <EnterpriseDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Customer */}
        <Route
          path="/customer/dashboard"
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-order"
          element={
            <ProtectedRoute requiredRole="customer">
              <BookOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:orderId/track"
          element={
            <ProtectedRoute requiredRole="customer">
              <OrderTracking />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes - Common */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/support"
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
