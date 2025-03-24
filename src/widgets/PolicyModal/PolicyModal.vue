<script setup lang="ts">
import { ref } from 'vue';

import { VButton, VModal } from '@/shared/ui';

const isOpen = ref(false);

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

defineExpose({ open });
</script>

<template>
  <VModal :is-open="isOpen" @close="close">
    <div class="modal">
      <div class="modal__inner">
        <div class="modal__title">Политика</div>
        <div class="modal__text"></div>
        <div class="modal__action">
          <VButton variant="primary" rounded @click="close">Закрыть</VButton>
        </div>
      </div>
    </div>
  </VModal>
</template>

<style scoped lang="scss">
.modal {
  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 12px;
    letter-spacing: 0.01em;
  }

  &__title {
    font-weight: 700;
    font-size: 40px;
  }

  &__picture {
    margin-block: 36px;
  }

  &__text {
    font-size: 24px;
  }
}
</style>
