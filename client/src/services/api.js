import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Interceptor para agregar token CSRF a todas las peticiones (POST, PUT, DELETE)
API.interceptors.request.use((config) => {
  const match = document.cookie.match(/(^|;)\s*csrfToken\s*=\s*([^;]+)/);
  if (match) {
    config.headers['X-CSRF-Token'] = match[2];
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;
