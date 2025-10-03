import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import { NotificationProvider } from './context/NotificationProvider';
import NotFoundPage from "./pages/public/NotFoundPage";

<Route path="*" element={<NotFoundPage />} />


// Public Pages
import LandingPage from './pages/public/LandingPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyPhonePage from './pages/auth/VerifyPhonePage';

// Buyer Pages
import MarketplacePage from './pages/buyer/MarketplacePage';
import ProductDetailPage from './pages/buyer/ProductDetailPage';
import CartPage from './pages/buyer/CartPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import BuyerOrdersPage from './pages/buyer/BuyerOrdersPage';
import OrderTrackingPage from './pages/buyer/OrderTrackingPage';
import PaymentHistoryPage from './pages/buyer/PaymentHistoryPage';
import BuyerProfilePage from './pages/buyer/BuyerProfilePage';

// Farmer Pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import ProductsManagement from './pages/farmer/ProductsManagement';
import InventoryPage from './pages/farmer/InventoryPage';
import ProductFormPage from './pages/farmer/ProductFormPage';
import FarmerOrdersPage from './pages/farmer/FarmerOrdersPage';
import FarmerProfilePage from './pages/farmer/FarmerProfilePage';
import RequestVisitPage from './pages/farmer/RequestVisitPage';
import FarmerAICropAnalysis from './pages/farmer/FarmerAICropAnalysis';
import FarmerWeatherInsights from './pages/farmer/FarmerWeatherInsights';

// Officer Pages
import OfficerDashboard from './pages/officer/OfficerDashboard';
import FarmersManagement from './pages/officer/FarmersManagement';
import SchedulePage from './pages/officer/SchedulePage';
import VisitRequestsPage from './pages/officer/VisitRequestsPage';
import OfficerProfilePage from './pages/officer/OfficerProfilePage';
import ReportsPage from './pages/officer/ReportsPage';
import VirtualConsultationPage from './pages/officer/VirtualConsultationPage';

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
    return <Navigate to="/dashboard" replace />;
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

// Dashboard Redirect Component
const DashboardRedirect = () => {
  const { currentRole } = useAuthContext();

  if (currentRole === 'farmer') {
    return <Navigate to="/dashboard/farmer" replace />;
  } else if (currentRole === 'officer') {
    return <Navigate to="/dashboard/officer" replace />;
  }
  return <Navigate to="/dashboard/marketplace" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPage />
          </PublicRoute>
        }
      />

      {/* ========== AUTH ROUTES ========== */}
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
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-phone"
        element={
          <PublicRoute>
            <VerifyPhonePage />
          </PublicRoute>
        }
      />

      {/* ========== DASHBOARD ROUTES ========== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard Index - Redirects based on role */}
        <Route index element={<DashboardRedirect />} />

        {/* ========== BUYER ROUTES ========== */}
        <Route path="marketplace" element={<MarketplacePage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="orders" element={<BuyerOrdersPage />} />
        <Route path="orders/:orderId/track" element={<OrderTrackingPage />} />
        <Route path="payments" element={<PaymentHistoryPage />} />
        <Route path="buyer/profile" element={<BuyerProfilePage />} />

        {/* ========== FARMER ROUTES ========== */}
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
          path="farmer/inventory"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <InventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/products/new"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <ProductFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/products/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <ProductFormPage />
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
        <Route
          path="farmer/profile"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/request-visit"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <RequestVisitPage />
            </ProtectedRoute>
          }
        />
        {/* NEW: AI FEATURES FOR FARMERS */}
        <Route
          path="farmer/ai-crop-analysis"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerAICropAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="farmer/weather-insights"
          element={
            <ProtectedRoute allowedRoles={['farmer']}>
              <FarmerWeatherInsights />
            </ProtectedRoute>
          }
        />

        {/* ========== OFFICER ROUTES ========== */}
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
        <Route
          path="officer/schedule"
          element={
            <ProtectedRoute allowedRoles={['officer']}>
              <SchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/visit-requests"
          element={
            <ProtectedRoute allowedRoles={['officer']}>
              <VisitRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/consultation"
          element={
            <ProtectedRoute allowedRoles={['officer']}>
              <VirtualConsultationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/reports"
          element={
            <ProtectedRoute allowedRoles={['officer']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="officer/profile"
          element={
            <ProtectedRoute allowedRoles={['officer']}>
              <OfficerProfilePage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ========== 404 ROUTE ========== */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;