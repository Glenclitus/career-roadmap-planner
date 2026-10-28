import axios from 'axios';

// All API calls go to the Express server
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send HttpOnly cookie on every request
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach Bearer token if available (cross-site fallback)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — redirect to /login if token is invalid/expired
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Do not redirect on login/register attempt failures or silent auth checks on public pages
      const isAuthRequest =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');
      const isAuthPage =
        window.location.pathname.startsWith('/login') ||
        window.location.pathname.startsWith('/register');
      const isLandingPage = window.location.pathname === '/';

      if (!isAuthRequest && !isAuthPage && !isLandingPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
