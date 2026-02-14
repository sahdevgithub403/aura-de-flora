import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// --- TOKEN UTILITIES ---

/**
 * Get the JWT token from localStorage
 */
export const getToken = () => localStorage.getItem('token');

/**
 * Decode JWT token payload (without verification - for client-side checks only)
 */
const decodeToken = (token) => {
  try {
    // Validate token is a non-empty string
    if (!token || typeof token !== 'string') {
      return null;
    }
    
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      console.warn('Invalid token format: expected 3 parts, got', parts.length);
      return null;
    }
    
    const base64Url = parts[1];
    if (!base64Url) {
      return null;
    }
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Check if JWT token is expired
 * Returns true if token is missing, invalid, or expired
 */
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  return currentTime > expirationTime;
};

/**
 * Check if user is properly authenticated (has valid, non-expired token)
 */
export const isAuthenticated = () => {
  const token = getToken();
  const user = localStorage.getItem('user');
  return !!(token && user && !isTokenExpired());
};

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Auth error handler - set by AuthContext
 */
let authErrorHandler = null;

export const setAuthErrorHandler = (handler) => {
  authErrorHandler = handler;
};

// --- AXIOS INSTANCE ---
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- PROTECTED ENDPOINTS ---
const PUBLIC_ENDPOINTS = ['/auth/'];

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    const url = config.url;
    
    // Attach token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const isAuthEndpoint = url?.includes('/auth/');
    
    // Handle 401/403 errors (except for login calls)
    if ((status === 401 || status === 403) && !isAuthEndpoint) {
      console.error(`Admin Auth Failure on ${url}: ${status}`);
      
      // Let AuthContext handle logout transition
      if (authErrorHandler) {
        const message = status === 401 
          ? 'Session expired. Please login again.' 
          : 'Access denied. Admin privileges required.';
        authErrorHandler(message);
      }
    }
    
    return Promise.reject(error);
  }
);

// --- AUTH API ---
export const authAPI = {
  login: (credentials) => api.post('/auth/signin', credentials),
};

// --- MENU API ---
export const menuAPI = {
  getMenuItems: () => api.get('/menu'),
  createMenuItem: (item) => api.post('/menu', item),
  updateMenuItem: (id, item) => api.put(`/menu/${id}`, item),
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
};

// --- ORDERS API ---
export const orderAPI = {
  getAllOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// --- ADMIN STATS API ---
export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getRevenueAnalytics: () => api.get('/admin/analytics/revenue'),
  getRecentOrders: (limit = 5) => api.get(`/admin/orders/recent?limit=${limit}`),
  getRestaurantStatus: () => api.get('/restaurant-status'),
  updateRestaurantStatus: (status) => api.put('/restaurant-status', status),
};

// --- RESERVATIONS API ---
export const reservationAPI = {
  getAllReservations: () => api.get('/reservations'),
  updateReservationStatus: (id, status) => api.put(`/reservations/${id}/status`, JSON.stringify(status)),
};

export default api;
