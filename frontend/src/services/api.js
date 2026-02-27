
import axios from 'axios';

// --- MOCK DATA REMOVED ---

// --- JWT TOKEN UTILITIES ---

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
  if (!decoded || !decoded.exp) return false; // Don't block if we can't decode exp

  const expirationTime = decoded.exp * 1000;
  const currentTime = Date.now();
  
  // Only return true if strictly after expiration (no aggressive buffer)
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
 * Get redirect function - used by interceptors to trigger navigation
 * This will be set by the AuthContext
 */
let authErrorHandler = null;

export const setAuthErrorHandler = (handler) => {
  authErrorHandler = handler;
};

// --- AXIOS INSTANCE ---
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// --- PUBLIC ENDPOINTS (no authentication required) ---
const PUBLIC_ENDPOINTS = [
  '/auth/',      // Login, signup, etc.
  '/menu',       // Menu items (public viewing)
  '/categories', // Categories (if exists)
];

// --- PROTECTED ENDPOINTS (authentication required) ---
const PROTECTED_ENDPOINTS = [
  '/payment/',   // Payment operations
  '/orders',     // Order placement
  '/user/',      // User profile operations
  '/reservations', // Reservation operations
];

/**
 * Check if URL matches any endpoint pattern
 */
const matchesEndpoint = (url, endpoints) => {
  return endpoints.some(endpoint => url?.includes(endpoint));
};

// --- REQUEST INTERCEPTOR ---
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
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
    
    // Auto-logout on 401 (expired/invalid token)
    if (status === 401 && !isAuthEndpoint) {
      clearAuthData();
      if (authErrorHandler) {
        authErrorHandler('Session expired. Please login again.');
      }
    }
    
    // Auto-logout on 403 (access denied / stale token)
    if (status === 403 && !isAuthEndpoint) {
      clearAuthData();
      if (authErrorHandler) {
        authErrorHandler('Access denied. Please login again.');
      }
    }
    
    return Promise.reject(error);
  }
);

// --- SERVICE FUNCTIONS ---

export const loginAPI = async (email, password) => {
   return api.post('/auth/signin', { username: email, password });
};

export const signupAPI = async (name, email, password) => {
   return api.post('/auth/signup', { fullName: name, username: email, email, password });
};

export const getMenuItemsAPI = async () => {
  return api.get('/menu');
};

// --- PROFILE API ---
export const getProfileAPI = () => api.get('/user/profile');
export const updateProfileAPI = (data) => api.patch('/user/profile', data); // Changed to patch or use existing put logic

// --- ORDER & PAYMENT API ---

// Create Razorpay Order
export const createPaymentOrderAPI = (amount) => api.post('/payment/create-order', { amount, currency: 'INR' });

// Verify Razorpay Payment
export const verifyPaymentAPI = (paymentData) => api.post('/payment/verify-payment', paymentData);

// Place Order (COD or Online)
export const placeOrderAPI = (orderData) => api.post('/orders', orderData);

// Save Address (Now calls real profile API)
export const saveAddressAPI = (address) => api.put('/user/profile', { address });

export default api;
