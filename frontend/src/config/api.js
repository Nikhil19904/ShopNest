// API Configuration
export const API_BASE_URL = 'http://localhost:3000/api';

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