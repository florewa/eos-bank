<script setup lang="ts">
import { ref } from 'vue';

import { VModal } from '@/shared/ui';

import loaderSrc from '@/shared/assets/img/Loader.svg?url';

const isOpen = ref(false);

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

defineExpose({ open, close });
</script>

<template>
  <VModal :is-open="isOpen" @close="close" :click-outside-close="false">
    <div class="modal-loader">
      <div class="modal-loader__inner">
        <h1 class="modal-loader__title">Пожалуйста, подождите</h1>
        <div class="modal-loader__text">
          В настоящий момент осуществляется проверка данных. Пожалуйста,
          подождите
        </div>
        <img
          :src="loaderSrc"
          width="128"
          height="128"
          alt="loader"
          class="modal-loader__img"
        />
      </div>
    </div>
  </VModal>
</template>

<style scoped lang="scss">
.modal-loader {
  max-width: 660px;

  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 24px;
    letter-spacing: 0.01em;
  }

  &__img {
    margin-top: 48px;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
