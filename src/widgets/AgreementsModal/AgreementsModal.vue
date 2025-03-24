<script setup lang="ts">
import { ref } from 'vue';

import IconX from '@/shared/assets/icons/IconX.svg';
import { VModal } from '@/shared/ui';
import AgreementsModalSlider from '@/widgets/AgreementsModal/ui/AgreementsModalSlider/AgreementsModalSlider.vue';

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
      <div class="modal__close" @click="close">
        <IconX />
      </div>
      <div class="modal__inner">
        <div class="modal__title">
          Cоглашения о порядке использования сервиса «Личный кабинет»
        </div>
      </div>
      <div class="modal__slider">
        <AgreementsModalSlider />
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
    margin-bottom: 24px;
  }

  &__picture {
    margin-block: 36px;
  }

  &__text {
    font-size: 24px;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    right: 0;
    top: -80px;
    position: absolute;
    cursor: pointer;
    border-radius: 24px;
    padding: 20px;
    background: var(--white);
  }
}
</style>
