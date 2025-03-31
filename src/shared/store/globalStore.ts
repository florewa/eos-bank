import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStore = defineStore('globalStore', () => {
  const isLoading = ref(false);
  const isSuccess = ref(false);

  const setIsLoading = (bool: boolean) => {
    isLoading.value = bool;
  };

  const setIsSuccess = (bool: boolean) => {
    isSuccess.value = bool;
  };

  return {
    isLoading,
    isSuccess,
    setIsLoading,
    setIsSuccess,
  };
});
