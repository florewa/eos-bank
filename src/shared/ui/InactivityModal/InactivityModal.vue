<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import warningSrc from '@/shared/assets/img/Warning.svg?url';
import { VButton, VModal } from '@/shared/ui';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/features/AccountAuthorization/model';

const emit = defineEmits(['update:standby']);

const router = useRouter();
const isOpen = ref(false);
const timer = ref(60);
let interval: ReturnType<typeof setInterval> | null = null;

const authStore = useAuthStore();

const open = () => {
  isOpen.value = true;
  timer.value = 60;

  if (interval) clearInterval(interval);
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1;
    } else {
      close();
      router.push('/');
      authStore.clearAuthData();
    }
  }, 1000);
};

const close = () => {
  isOpen.value = false;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

const goHome = () => {
  close();
  emit('update:standby', true);
  router.push('/');
  authStore.clearAuthData();
};

defineExpose({ open, close });
</script>

<template>
  <VModal :is-open="isOpen" @close="close">
    <div class="modal">
      <div class="modal__inner">
        <div class="modal-picture">
          <img :src="warningSrc" alt="picture" width="128" height="128" />
        </div>
        <div class="modal__title">Хотите продолжить?</div>
        <div class="modal__text">
          Выход на начальный экран произойдет через
          <span>{{ timer }}</span> секунд
        </div>
        <div class="modal__actions">
          <VButton variant="outline" @click="goHome">Выйти</VButton>
          <VButton variant="primary" @click="close">Продолжить</VButton>
        </div>
      </div>
    </div>
  </VModal>
</template>

<style scoped lang="scss">
.modal {
  max-width: 564px;

  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 48px;
    letter-spacing: 0.01em;
  }

  &__title {
    font-weight: 700;
    font-size: 40px;
  }

  &__text {
    margin-top: -24px;
    font-size: 20px;

    span {
      font-weight: 700;
      color: var(--red-accent);
    }
  }

  &__actions {
    width: 100%;
    display: flex;
    gap: 24px;

    button {
      flex: 1;
    }
  }
}
</style>
