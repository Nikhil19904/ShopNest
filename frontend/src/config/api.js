// src/config/api.js

// Base API URL
export const API_BASE_URL = 'http://localhost:3001/api';

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    USER: '/auth/user',
    LOGOUT: '/auth/logout'
  },
  PRODUCTS: {
    LIST: '/products',
    DETAIL: (id) => `/products/${id || ''}`,
    CREATE: '/products',
    UPDATE: (id) => `/products/${id || ''}`,
    DELETE: (id) => `/products/${id || ''}`,
    SEARCH: '/products/search'
  },
  CART: {
    GET: '/cart',
    ADD: '/cart/add',
    UPDATE: '/cart/update',
    REMOVE: '/cart/remove',
    CLEAR: '/cart/clear'
  },
  ORDERS: {
    CREATE: '/orders',
    LIST: '/orders',
    DETAIL: (id) => `/orders/${id || ''}`,
    UPDATE: (id) => `/orders/${id || ''}`
  }
};

// Generic API request function
export const apiRequest = async (method, endpoint, data = null) => {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const config = {
    method,
    headers,
    credentials: 'include',
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 404) {
      return { success: false, message: 'Resource not found', statusCode: 404 };
    }

    const resData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: resData.message || `Error: ${response.status}`,
        statusCode: response.status,
      };
    }

    return { success: true, data: resData };
  } catch (err) {
    console.error('API Request Error:', err);
    return { success: false, message: err.message || 'Network error' };
  }
};

// Shortcut methods
export const get = (endpoint) => apiRequest('GET', endpoint);
export const post = (endpoint, data) => apiRequest('POST', endpoint, data);
export const put = (endpoint, data) => apiRequest('PUT', endpoint, data);
export const del = (endpoint) => apiRequest('DELETE', endpoint);

// Default export for convenience
const api = { apiRequest, get, post, put, delete: del, ENDPOINTS, API_BASE_URL };
export default api;
