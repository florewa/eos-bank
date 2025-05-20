<script setup lang="ts">
import { ref, watch } from 'vue';
import { VModal } from '@/shared/ui';
import IconError from '@/shared/assets/icons/IconError.svg';
import IconX from '@/shared/assets/icons/IconX.svg';
import { useRoute, useRouter } from 'vue-router';
import { useGlobalStore } from '@/shared/store/globalStore.ts';

const router = useRouter();
const route = useRoute();
const globalStore = useGlobalStore();
const isOpen = ref(false);
const timer = ref(20);
let interval: ReturnType<typeof setInterval> | null = null;

watch(
  () => globalStore.isError,
  (newValue) => {
    if (newValue) {
      open();
    } else {
      close();
    }
  }
);

const open = () => {
  resetState();
  isOpen.value = true;
  startTimer();
};

const startTimer = () => {
  timer.value = 20;
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value -= 1;
    } else {
      close();
    }
  }, 1000);
};

const resetState = () => {
  isOpen.value = false;
  timer.value = 20;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};

const close = () => {
  resetState();
  globalStore.setIsError(false);
  if (route.path.includes('payment')) {
    router.push('/pay-debt');
  }
};

defineExpose({ open, close });
</script>

<template>
  <VModal :is-open="isOpen" @close="close">
    <div class="modal-error">
      <div class="modal-error__inner">
        <IconError />
        <h1 class="modal-error__title">Произошла ошибка</h1>
        <div class="modal-error__text">
          Повторите операцию. <br />
          Окно закроется через <span>{{ timer }}</span> секунд
        </div>
      </div>
      <div class="modal-error__close-btn" @click="close">
        <IconX />
      </div>
    </div>
  </VModal>
</template>

<style scoped lang="scss">
.modal-error {
  position: relative;
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

    svg {
      width: 120px;
      height: 120px;
      color: var(--red-accent);
    }
  }

  &__close-btn {
    position: absolute;
    border-radius: 24px;
    cursor: pointer;
    top: -140px;
    right: -40px;
    padding: 20px;
    background: var(--white);

    svg {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
