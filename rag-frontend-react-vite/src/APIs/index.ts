import axios, { type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({ baseURL: 'http://localhost:5001' });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



export const DATA_SERVICE = axios.create({ baseURL: 'http://localhost:8001' });

DATA_SERVICE.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});