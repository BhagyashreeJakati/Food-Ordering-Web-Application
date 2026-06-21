import axios from "axios";

const api = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/v1' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      const url = err.config?.url || '';
      // Never redirect on login/register endpoints — they handle their own errors
      const isAuthEndpoint = url.includes('/user/login') || url.includes('/user/register');
      if (!isAuthEndpoint) {
        localStorage.removeItem('jwtToken');
        window.location.href = '/account/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
