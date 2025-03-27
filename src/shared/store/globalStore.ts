import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGlobalStore = defineStore('globalStore', () => {
  const isLoading = ref(false);

  const setIsLoading = (bool: boolean) => {
    isLoading.value = bool;
  };
  return {
    isLoading,
    setIsLoading,
  };
});
