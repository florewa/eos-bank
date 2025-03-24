<script setup lang="ts">
import { ref } from 'vue';

import { VButton } from '@/shared/ui';
import VModal from '@/shared/ui/VModal/VModal.vue';

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
        <div class="modal__title">Помощь</div>
        <div class="modal__text">
          Если у Вас возник вопрос по услугам:
          <span class="bold">
            «Узнать <br />
            о задолженности»
          </span>
          и <span class="bold">«Оплатить задолженность»</span>, то звоните по
          номеру —
          <span class="red">8 (800) 555-17-10</span>
        </div>
        <div class="modal__text">
          Если у Вас возник вопрос по услугам:
          <span class="bold">«Получить кредит в банке»</span>,
          <span class="bold">«Получить деньги на карту»</span>,
          <span class="bold">«Оформить ОСАГО»</span>, то звоните <br />
          по номеру —
          <span class="red">8 (800) 707-39-02</span>
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

    .bold {
      font-weight: 700;
    }

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
