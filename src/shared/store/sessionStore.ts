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
    if (window.sessionStore?.id) {
      id.value = window.sessionStore.id;
    } else {
      id.value = generateNumericId();
      window.sessionStore = window.sessionStore || {};
      window.sessionStore.id = id.value;
    }
    console.log('[SESSION] new id →', id.value);
  };

  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    newSession();
  } else {
    window.addEventListener('DOMContentLoaded', newSession, { once: true });
  }

  return {
    id,
    newSession,
  };
});
