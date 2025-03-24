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
        <div class="modal__title">Идентификационный номер</div>
        <div class="modal__text">
          Если Вы не знаете свой идентификационный номер обратитесь в
          контакт-центр по номеру <br />
          <span class="red">8 (800) 555-17-10</span> c 5:00 до 20:00 мск
          <br />(Звонок по России бесплатный).
        </div>
        <div class="modal__action">
          <VButton variant="primary" @click="close">Закрыть</VButton>
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
    gap: 24px;
    letter-spacing: 0.01em;
  }

  &__title {
    font-weight: 700;
    font-size: 40px;
  }

  &__text {
    font-size: 20px;

    .red {
      font-weight: 700;
      color: var(--red-accent);
    }
  }

  &__action {
    margin-top: 24px;
  }
}
</style>
