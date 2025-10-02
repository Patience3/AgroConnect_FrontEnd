// src/services/mockApiHandler.js
import { MOCK_API_RESPONSES, DEVELOPMENT_MODE } from '@/config/development';

/**
 * Mock API handler for development mode
 * Intercepts API calls and returns mock data
 */
class MockApiHandler {
  constructor() {
    this.delay = 300; // Simulate network delay
  }

  async handleRequest(method, url, data = null) {
    if (!DEVELOPMENT_MODE || import.meta.env.MODE !== 'development') {
      return null; // Let real API handle it
    }

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.delay));

    console.log(`🔧 Mock API: ${method} ${url}`, data);

    // Parse URL and extract endpoint
    const endpoint = url.replace('/api', '').split('?')[0];

    // Handle different endpoints
    if (endpoint.includes('/products')) {
      return this.handleProducts(method, endpoint, data);
    }

    if (endpoint.includes('/orders')) {
      return this.handleOrders(method, endpoint, data);
    }

    if (endpoint.includes('/visits')) {
      return this.handleVisits(method, endpoint, data);
    }

    if (endpoint.includes('/farmers')) {
      return this.handleFarmers(method, endpoint, data);
    }

    if (endpoint.includes('/auth')) {
      return this.handleAuth(method, endpoint, data);
    }

    // Default: return empty success response
    return { data: { success: true, message: 'Mock response' } };
  }

  handleProducts(method, endpoint, data) {
    const products = MOCK_API_RESPONSES.products;

    if (method === 'GET') {
      if (endpoint.match(/\/products\/[\w-]+$/)) {
        // Get single product
        const id = endpoint.split('/').pop();
        const product = products.find(p => p.id === id);
        return { data: product || products[0] };
      }
      
      // Get all products (with filters)
      return { 
        data: { 
          products,
          total: products.length,
          page: 1,
          limit: 20
        }
      };
    }

    if (method === 'POST') {
      // Create product
      const newProduct = {
        id: `prod-${Date.now()}`,
        ...data,
        created_at: new Date().toISOString(),
        status: 'available',
        images: [],
      };
      return { data: newProduct };
    }

    if (method === 'PUT' || method === 'PATCH') {
      // Update product
      return { data: { ...data, updated_at: new Date().toISOString() } };
    }

    if (method === 'DELETE') {
      // Delete product
      return { data: { success: true, message: 'Product deleted' } };
    }

    return { data: { products } };
  }

  handleOrders(method, endpoint, data) {
    const orders = MOCK_API_RESPONSES.orders;

    if (method === 'GET') {
      if (endpoint.match(/\/orders\/[\w-]+$/)) {
        // Get single order
        const id = endpoint.split('/').pop();
        const order = orders.find(o => o.id === id);
        return { data: order || orders[0] };
      }

      // Get all orders
      return { 
        data: { 
          orders,
          total: orders.length,
          page: 1,
          limit: 20
        }
      };
    }

    if (method === 'POST') {
      // Create order
      const newOrder = {
        id: `order-${Date.now()}`,
        order_number: `ORD-2025-${String(Date.now()).slice(-5)}`,
        status: 'pending',
        payment_status: 'pending',
        ...data,
        created_at: new Date().toISOString(),
      };
      return { data: newOrder };
    }

    if (method === 'PUT' || method === 'PATCH') {
      // Update order status
      return { 
        data: { 
          ...orders[0], 
          ...data,
          updated_at: new Date().toISOString() 
        }
      };
    }

    return { data: { orders } };
  }

  handleVisits(method, endpoint, data) {
    const visits = MOCK_API_RESPONSES.visits;

    if (method === 'GET') {
      if (endpoint.includes('/my-visits') || endpoint.includes('/assigned')) {
        return { 
          data: { 
            visits,
            total: visits.length,
            page: 1,
            limit: 20
          }
        };
      }

      if (endpoint.match(/\/visits\/[\w-]+$/)) {
        // Get single visit
        const id = endpoint.split('/').pop();
        const visit = visits.find(v => v.id === id);
        return { data: visit || visits[0] };
      }

      return { data: { visits } };
    }

    if (method === 'POST') {
      if (endpoint.includes('/request')) {
        // Request visit
        const newVisit = {
          id: `visit-${Date.now()}`,
          status: 'requested',
          ...data,
          requested_at: new Date().toISOString(),
        };
        return { data: newVisit };
      }

      // Other visit operations
      return { data: { success: true, ...data } };
    }

    if (method === 'PUT') {
      // Update visit
      return { 
        data: { 
          ...visits[0], 
          ...data,
          updated_at: new Date().toISOString() 
        }
      };
    }

    return { data: { visits } };
  }

  handleFarmers(method, endpoint, data) {
    const farmers = MOCK_API_RESPONSES.farmers;

    if (method === 'GET') {
      if (endpoint.match(/\/farmers\/[\w-]+\/products/)) {
        // Get farmer's products
        return { 
          data: { 
            products: MOCK_API_RESPONSES.products,
            total: MOCK_API_RESPONSES.products.length
          }
        };
      }

      if (endpoint.match(/\/farmers\/[\w-]+$/)) {
        // Get single farmer
        const id = endpoint.split('/').pop();
        const farmer = farmers.find(f => f.id === id);
        return { data: farmer || farmers[0] };
      }

      // Get all farmers
      return { 
        data: { 
          farmers,
          total: farmers.length
        }
      };
    }

    return { data: { farmers } };
  }

  handleAuth(method, endpoint, data) {
    if (endpoint.includes('/me') || endpoint.includes('/profile')) {
      // Get current user profile
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      return { data: userData };
    }

    if (method === 'POST') {
      if (endpoint.includes('/login') || endpoint.includes('/register')) {
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        return { 
          data: { 
            user: userData,
            token: localStorage.getItem('auth_token')
          }
        };
      }
    }

    if (method === 'PUT') {
      // Update profile
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      const updatedUser = { ...userData, ...data };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
      return { data: updatedUser };
    }

    return { data: { success: true } };
  }
}

export const mockApiHandler = new MockApiHandler();

export default mockApiHandler;