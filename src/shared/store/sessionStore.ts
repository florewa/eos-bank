import { defineStore } from 'pinia';
import { ref } from 'vue';

function generateNumericId() {
  const timestampPart = Date.now().toString().slice(-6);
  const randomPart = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return timestampPart + randomPart;
}

export const useSessionStore = defineStore('sessionStore', () => {
  const id = ref('');

  const newSession = () => {
    id.value = generateNumericId();
    console.log('[SESSION] new id →', id.value);
  };

  return {
    id,
    newSession,
  };
});
