import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && !config.url.includes('/auth')) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/signin', credentials),
};

export const menuAPI = {
    getMenuItems: () => api.get('/menu'),
    createMenuItem: (item) => api.post('/menu', item),
    updateMenuItem: (id, item) => api.put(`/menu/${id}`, item),
    deleteMenuItem: (id) => api.delete(`/menu/${id}`),
};

export const orderAPI = {
    getAllOrders: () => api.get('/orders'),
    updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, status),
};

export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
};

export default api;
