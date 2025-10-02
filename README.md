# 🌾 AgroConnect - Agricultural Marketplace PWA

> Connecting African farmers directly with buyers through a modern digital marketplace

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Design System](#design-system)
- [User Roles](#user-roles)
- [API Integration](#api-integration)
- [Contributing](#contributing)

## 🎯 Overview

AgroConnect is a comprehensive digital marketplace that empowers farmers by providing direct market access, transparent pricing, and quality assurance through verified extension officers. The platform supports three user roles: Farmers, Buyers, and Extension Officers.

### Key Objectives

- **Direct Market Access**: Connect farmers directly with buyers, eliminating middlemen
- **Transparent Pricing**: Fair market prices for both farmers and buyers
- **Quality Assurance**: Verified farmers through extension officer oversight
- **Sustainable Agriculture**: Support local farming communities

## ✨ Features

### For Farmers 🌱
- Product listing and inventory management
- Order management and fulfillment
- Real-time payment tracking with escrow
- Request extension officer visits
- Sales analytics and insights

### For Buyers 🛒
- Browse marketplace with advanced filters
- Location-based product discovery
- Secure checkout with multiple payment options
- Order tracking and history
- Product reviews and ratings

### For Extension Officers 👨‍🌾
- Farmer verification and management
- Schedule farm visits
- Provide advisory services
- Monitor farmer progress
- Generate reports and analytics

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **date-fns** - Date utilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

### Deployment
- **Docker** - Containerization
- **Nginx** - Web server

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets
│   ├── logo.svg
│   ├── manifest.json
│   └── patterns/
│       └── kente.svg
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   └── Input.jsx
│   │   └── layouts/       # Layout components
│   │       └── DashboardLayout.jsx
│   ├── pages/             # Page components
│   │   ├── auth/          # Authentication pages
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── buyer/         # Buyer pages
│   │   │   ├── MarketplacePage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   └── BuyerOrdersPage.jsx
│   │   ├── farmer/        # Farmer pages
│   │   │   ├── FarmerDashboard.jsx
│   │   │   ├── ProductsManagement.jsx
│   │   │   └── FarmerOrdersPage.jsx
│   │   ├── officer/       # Officer pages
│   │   │   ├── OfficerDashboard.jsx
│   │   │   └── FarmersManagement.jsx
│   │   └── public/        # Public pages
│   │       └── LandingPage.jsx
│   ├── services/          # API services
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── productsService.js
│   │   └── ordersService.js
│   ├── hooks/             # Custom React hooks
│   │   └── useAuth.js
│   ├── context/           # React contexts
│   │   └── AuthProvider.jsx
│   ├── utils/             # Utility functions
│   │   └── helpers.js
│   ├── types/             # Type definitions and constants
│   │   └── index.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── .env.example           # Environment variables template
├── Dockerfile             # Docker configuration
├── nginx.conf             # Nginx configuration
├── package.json           # Dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.js         # Vite configuration
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/agroconnect-frontend.git
   cd agroconnect-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure your API endpoint:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 💻 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

### Code Style

This project uses:
- **ESLint** for JavaScript linting
- **Prettier** for code formatting
- **Tailwind CSS** for styling

### Component Development

All components follow these conventions:
- Use functional components with hooks
- Props are destructured in component signature
- Use Tailwind utility classes for styling
- Keep components focused and reusable

Example:
```jsx
import { useState } from 'react';
import Button from '@/components/ui/Button';

const MyComponent = ({ title, onSubmit }) => {
  const [data, setData] = useState('');
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
};

export default MyComponent;
```

## 🎨 Design System

### Color Palette

**Primary Colors**
- Dark: `#0B0C10` - Main background
- Light: `#1F2833` - Cards and surfaces

**Accent Colors**
- Cyan: `#66FCF1` - Primary actions
- Teal: `#45A29E` - Secondary actions

**Status Colors**
- Success: `#10B981`
- Warning: `#F59E0B`
- Error: `#EF4444`
- Info: `#3B82F6`

### Typography

- **Font Family**: Inter (sans-serif), JetBrains Mono (monospace for prices)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, neutral colors
- **Prices**: Monospace font for clarity

### Components

All UI components are in `src/components/ui/`:
- `Button` - Primary, secondary, outline, ghost, danger variants
- `Card` - Container with optional title, subtitle, footer
- `Input` - Text input with label, error, helper text
- More components can be added as needed

## 👥 User Roles

### 1. Farmer
**Access**: Product management, order fulfillment, inventory tracking

**Key Pages**:
- `/dashboard/farmer` - Dashboard with stats
- `/dashboard/farmer/products` - Manage products
- `/dashboard/farmer/orders` - Process orders

### 2. Buyer
**Access**: Browse marketplace, place orders, track deliveries

**Key Pages**:
- `/dashboard/marketplace` - Browse products
- `/dashboard/product/:id` - Product details
- `/dashboard/checkout` - Complete purchase
- `/dashboard/orders` - Order history

### 3. Extension Officer
**Access**: Verify farmers, schedule visits, provide support

**Key Pages**:
- `/dashboard/officer` - Dashboard overview
- `/dashboard/officer/farmers` - Manage farmers
- `/dashboard/officer/schedule` - Schedule visits

## 🔌 API Integration

### Authentication

All API requests automatically include the JWT token from localStorage:

```javascript
import authService from '@/services/authService';

// Login
const { user, token } = await authService.login({
  phone_number: '+233501234567',
  password: 'password123'
});

// Get current user
const user = authService.getCurrentUser();

// Logout
authService.logout();
```

### Products

```javascript
import productsService from '@/services/productsService';

// Get products
const products = await productsService.getProducts({
  category: 'vegetables',
  is_organic: true,
  page: 1,
  limit: 20
});

// Create product (farmer only)
const newProduct = await productsService.createProduct({
  name: 'Fresh Tomatoes',
  price_per_unit: 5.50,
  quantity_available: 100
});
```

### Orders

```javascript
import ordersService from '@/services/ordersService';

// Create order
const order = await ordersService.createOrder({
  items: [
    { product_id: 'uuid', quantity: 10 }
  ],
  delivery_address: '123 Main St'
});

// Update order status
await ordersService.updateOrderStatus(orderId, 'confirmed');
```

## 🐳 Deployment

### Docker Deployment

1. **Build Docker image**
   ```bash
   docker build -t agroconnect-frontend .
   ```

2. **Run container**
   ```bash
   docker run -p 80:80 agroconnect-frontend
   ```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

### Environment Variables

For production, set these environment variables:
```bash
VITE_API_URL=https://api.agroconnect.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **Farmers**: The backbone of our agricultural system
- **Extension Officers**: For their dedication to farmer support
- **Community**: For feedback and contributions

## 📞 Support

For support, email support@agroconnect.com or join our Slack channel.

---

**Made with ❤️ for African Agriculture**