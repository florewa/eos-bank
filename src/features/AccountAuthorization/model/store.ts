import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { AuthResponse } from '@/features/AccountAuthorization/model/types.ts';
import type {
  UserInfoResponse,
  UserStatisticsResponse,
  UserStockResponse,
} from '@/entities/user';

export const useAuthStore = defineStore('auth', () => {
  const sessionId = ref<string | null>(null);
  const tokenSms = ref<string | null>(null);
  const isAuthenticated = ref(false);
  const error = ref<string | null>(null);

  const userData = ref<UserInfoResponse['result'] | null>(null);
  const userStatistics = ref<UserStatisticsResponse['result'] | null>(null);
  const userStock = ref<UserStockResponse['result'] | null>(null);

  const setAuthData = (response: AuthResponse) => {
    sessionId.value = response.session_id;
    tokenSms.value = response.result.token_sms;
    error.value = response.error || null;

    if (response.result.auth_code === 1) {
      localStorage.setItem('session_id', response.session_id);
      localStorage.setItem('token_sms', response.result.token_sms);
    }
  };

  const setAuthenticated = () => {
    isAuthenticated.value = true;
  };

  const setUserData = (data: UserInfoResponse['result']) => {
    userData.value = data;
  };

  const setUserStatistics = (data: UserStatisticsResponse['result']) => {
    userStatistics.value = data;
  };

  const setUserStock = (data: UserStockResponse['result']) => {
    userStock.value = data;
  };

  const isUserDataComplete = () => {
    return (
      userData.value !== null &&
      userStatistics.value !== null &&
      userStock.value !== null
    );
  };

  const clearAuthData = () => {
    sessionId.value = null;
    tokenSms.value = null;
    isAuthenticated.value = false;
    error.value = null;
    userData.value = null;
    userStatistics.value = null;
    userStock.value = null;
    localStorage.removeItem('session_id');
    localStorage.removeItem('token_sms');
  };

  return {
    sessionId,
    tokenSms,
    isAuthenticated,
    error,
    userData,
    userStatistics,
    userStock,
    setAuthData,
    setAuthenticated,
    setUserData,
    setUserStatistics,
    setUserStock,
    isUserDataComplete,
    clearAuthData,
  };
});
