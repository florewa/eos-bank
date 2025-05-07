import axios from 'axios';
import { useGlobalStore } from '@/shared/store/globalStore.ts';

export const API_URL = window.API;
export const PAYMENT_URL = window.PAYMENT_API;

if (!API_URL) {
  console.error('VITE_API_URL is not defined in .env file');
}

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

export const paymentApi = axios.create({
  baseURL: PAYMENT_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const globalStore = useGlobalStore();
    globalStore.setIsLoading(true);
    return config;
  },
  (error) => {
    const globalStore = useGlobalStore();
    globalStore.setIsLoading(false);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    const globalStore = useGlobalStore();
    globalStore.setIsLoading(false);
    return response;
  },
  (error) => {
    const globalStore = useGlobalStore();
    globalStore.setIsLoading(false);

    if (axios.isAxiosError(error)) {
      console.error(
        `Axios error ${error.response?.status}:`,
        error.response?.data
      );
    } else {
      console.error('Unexpected error:', error);
    }

    return Promise.reject(error);
  }
);

paymentApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

paymentApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      console.error(
        `Axios error ${error.response?.status}:`,
        error.response?.data
      );
    } else {
      console.error('Unexpected error:', error);
    }

    return Promise.reject(error);
  }
);
