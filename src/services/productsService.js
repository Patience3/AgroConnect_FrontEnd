import api from './api';

const productsService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        queryParams.append(key, params[key]);
      }
    });

    const response = await api.get(`/products?${queryParams.toString()}`);
    return response.data;
  },

  // Get single product
  getProduct: async (productId) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  // Create product (farmer only)
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // Update product
  updateProduct: async (productId, productData) => {
    const response = await api.put(`/products/${productId}`, productData);
    return response.data;
  },

  // Delete product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  // Upload product images
  uploadProductImages: async (productId, files) => {
    const response = await api.uploadFiles(
      `/products/${productId}/images`,
      files
    );
    return response.data;
  },

  // Delete product image
  deleteProductImage: async (productId, imageId) => {
    const response = await api.delete(
      `/products/${productId}/images/${imageId}`
    );
    return response.data;
  },

  // Update product status
  updateProductStatus: async (productId, status) => {
    const response = await api.patch(`/products/${productId}/status`, {
      status,
    });
    return response.data;
  },

  // Update product quantity
  updateProductQuantity: async (productId, quantity) => {
    const response = await api.patch(`/products/${productId}/quantity`, {
      quantity_available: quantity,
    });
    return response.data;
  },

  // Get farmer's products
  getFarmerProducts: async (farmerId, params = {}) => {
    const queryParams = new URLSearchParams(params);
    const response = await api.get(
      `/farmers/${farmerId}/products?${queryParams.toString()}`
    );
    return response.data;
  },

  // Search products
  searchProducts: async (searchTerm, filters = {}) => {
    const params = {
      search: searchTerm,
      ...filters,
    };
    return productsService.getProducts(params);
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    return productsService.getProducts({
      category,
      ...params,
    });
  },

  // Get nearby products (location-based)
  getNearbyProducts: async (latitude, longitude, radius = 50, params = {}) => {
    return productsService.getProducts({
      lat: latitude,
      lng: longitude,
      radius,
      ...params,
    });
  },

  // Get featured products
  getFeaturedProducts: async (limit = 10) => {
    return productsService.getProducts({
      featured: true,
      limit,
    });
  },

  // Get organic products
  getOrganicProducts: async (params = {}) => {
    return productsService.getProducts({
      is_organic: true,
      ...params,
    });
  },

  // Bulk update products
  bulkUpdateProducts: async (updates) => {
    const response = await api.post('/products/bulk-update', {
      updates,
    });
    return response.data;
  },
};

export default productsService;