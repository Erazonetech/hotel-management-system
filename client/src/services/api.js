import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/updatedetails', data),
  updatePassword: (data) => api.put('/auth/updatepassword', data),
};

// Menu services
export const menuService = {
  getMenuItems: (params) => api.get('/menu/items', { params }),
  getMenuItem: (id) => api.get(`/menu/items/${id}`),
  getCategories: () => api.get('/menu/categories'),
  getPopularItems: () => api.get('/menu/items/popular'),
  createMenuItem: (data) => api.post('/menu/items', data), 
  updateMenuItem: (id, data) => api.put(`/menu/items/${id}`, data),  
  deleteMenuItem: (id) => api.delete(`/menu/items/${id}`),  
  toggleAvailability: (id) => api.patch(`/menu/items/${id}/availability`),
};

// Order services
export const orderService = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

// Table services
export const tableService = {
  getTables: () => api.get('/tables'),
  getAvailableTables: (params) => api.get('/tables/available', { params }),
  updateTableStatus: (id, status) => api.patch(`/tables/${id}/status`, { status }),
};

// Analytics services (admin only)
export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSalesReport: (params) => api.get('/analytics/sales', { params }),
};

export default api;