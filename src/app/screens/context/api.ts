// src/app/screens/context/api.ts
// Bước 3: Tự động gửi vùng miền lên Backend trong mọi API (Axios Interceptor)
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@/config/api';

const api = axios.create({
  baseURL: `${BASE_URL || 'http://localhost:5000'}/api`,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  let currentRegion = 'nam';
  try {
    const saved = await AsyncStorage.getItem('APP_REGION');
    if (saved) currentRegion = saved;
  } catch (_) {}
  config.headers['x-region'] = currentRegion;
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;

