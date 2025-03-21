import axios from 'axios';

export const API_URL = window.API;

export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
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
