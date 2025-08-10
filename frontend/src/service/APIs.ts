import axios, { InternalAxiosRequestConfig } from 'axios';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  // Only run this on client side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default API;