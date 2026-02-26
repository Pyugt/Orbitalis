/**
 * Axios instance pre-configured for the Orbitalis backend API.
 * The base URL falls back to '/api' which Vite proxies in development.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor — unwrap the data envelope
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.error?.message || error.message || 'API error';
    return Promise.reject(new Error(message));
  }
);

export const fetchPlanets = () => api.get('/planets');
export const fetchPlanet = (id) => api.get(`/planets/${id}`);
export const saveSimulation = (data) => api.post('/simulations', data);
export const fetchSimulations = (userId) => api.get(`/simulations/${userId}`);

export default api;
