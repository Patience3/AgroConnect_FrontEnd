import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthProvider';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Buyer Pages
import MarketplacePage from './pages/buyer/MarketplacePage';
import ProductDetailPage from './pages/buyer/ProductDetailPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import BuyerOrdersPage from './pages/buyer/BuyerOrdersPage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import ProductsManagement from './pages/farmer/ProductsManagement';
import FarmerOrdersPage from './pages/farmer/FarmerOrdersPage';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import FarmersManagement from './pages/officer/FarmersManagement';

// Layouts
import DashboardLayout from './components/layouts/DashboardLayout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, isLoading, currentRole } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-dark">
        <div className="spinner"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Buyer Routes */}
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<BuyerOrdersPage />} />

        {/* Farmer Routes */}
        <Route
          path="farmer"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/products"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <ProductsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/orders"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Officer Routes */}
        <Route
          path="officer"
          element={
            <ProtectedRoute allowedRoles={['officer']}>
              <OfficerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/farmers"
          element={
            <ProtectedRoute allowedRoles={['officer']}>
              <FarmersManagement />
            </ProtectedRoute>
          }
        />

        {/* Default dashboard redirect based on role */}
        <Route index element={<Navigate to="marketplace" replace />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;