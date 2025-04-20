import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
      throw new Error('Request timeout. Please try again.');
    }
    if (error.response) {
      // Server responded with error status
      console.error('Server error:', error.response.data);
      throw new Error(error.response.data.message || error.response.data.error || 'Server error occurred');
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
      throw new Error('Failed to make request. Please try again.');
    }
  }
);

export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error(error.message || 'Failed to fetch products');
  }
};

export const getProduct = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error(error.message || 'Failed to fetch product');
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await api.post('/products', productData);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error(error.message || 'Failed to create product');
  }
};

export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/products/${id}`, productData);
    if (!response.data) {
      throw new Error('No data received from server');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error(error.message || 'Failed to update product');
  }
};

export const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error(error.message || 'Failed to delete product');
  }
};
