import axios from 'axios';

/**
 * API Service
 * Centralized API client for all backend communication.
 * This layer abstracts HTTP calls and provides error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for global error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

/**
 * Task API Methods
 */

export const taskAPI = {
  // Get all tasks
  getTasks: async (status = null) => {
    const response = await api.get('/tasks', {
      params: status ? { status } : {}
    });
    return response.data.data;
  },

  // Get single task
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data.data;
  },

  // Create new task
  createTask: async (title, description = '', status = 'todo') => {
    const response = await api.post('/tasks', {
      title,
      description,
      status
    });
    return response.data.data;
  },

  // Update task
  updateTask: async (id, updates) => {
    const response = await api.put(`/tasks/${id}`, updates);
    return response.data.data;
  },

  // Move task to different column
  moveTask: async (id, status, position) => {
    const response = await api.patch(`/tasks/${id}/move`, {
      status,
      position
    });
    return response.data.data;
  },

  // Delete task
  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
    return true;
  },

  // Get activity log
  getActivityLog: async (limit = 50) => {
    const response = await api.get('/activity/log', {
      params: { limit }
    });
    return response.data.data;
  }
};

export default api;
