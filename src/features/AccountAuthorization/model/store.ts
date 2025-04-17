import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AuthResponse } from '@/features/AccountAuthorization/model/types.ts';

export const useAuthStore = defineStore('auth', () => {
  const sessionId = ref<string | null>(null);
  const authCode = ref<0 | 1 | 2 | null>(null);
  const tokenSms = ref<string | null>(null);
  const isAuthenticated = ref(false);
  const error = ref<string | null>(null);

  const setAuthData = (response: AuthResponse) => {
    sessionId.value = response.session_id;
    authCode.value = response.result.auth_code;
    tokenSms.value = response.result.token_sms;
    isAuthenticated.value = response.result.auth_code === 1;
    error.value = response.error || null;

    if (response.result.auth_code === 1) {
      localStorage.setItem('session_id', response.session_id);
    }
  };

  const clearAuthData = () => {
    sessionId.value = null;
    authCode.value = null;
    tokenSms.value = null;
    isAuthenticated.value = false;
    error.value = null;
    localStorage.removeItem('session_id');
  };

  return {
    sessionId,
    authCode,
    tokenSms,
    isAuthenticated,
    error,
    setAuthData,
    clearAuthData,
  };
});
