<script setup lang="ts">
import { ref } from 'vue';
import { VModal } from '@/shared/ui';
import likeSrc from '@/shared/assets/img/Like.svg?url';

const isOpen = ref(false);
const timer = ref(20);
let interval: ReturnType<typeof setInterval> | null = null;

const open = () => {
  isOpen.value = true;
  timer.value = 20;

  if (interval) clearInterval(interval);
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1;
    } else {
      close();
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

defineExpose({ open, close });
</script>

<template>
  <VModal :is-open="isOpen" @close="close">
    <div class="modal-loader">
      <div class="modal-loader__inner">
        <img :src="likeSrc" alt="icon-like" />
        <h1 class="modal-loader__title">Благодарим за платеж!</h1>
        <div class="modal-loader__text">
          Оплата успешно произведена. Окно закроется через
          <span>{{ timer }}</span> секунд
        </div>
      </div>
    </div>
  </VModal>
</template>

<style scoped lang="scss">
.modal-loader {
  max-width: 660px;

  span {
    font-weight: 700;
    color: var(--red-accent);
  }

  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 24px;
    letter-spacing: 0.01em;
  }
}
</style>
