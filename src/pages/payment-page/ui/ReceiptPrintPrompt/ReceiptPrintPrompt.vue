<script setup lang="ts">
import IconArrowLeft from '@/shared/assets/icons/IconArrowLeft.svg';
import receiptSrc from '@/shared/assets/img/Receipt.svg?url';
import { VButton } from '@/shared/ui';

const emit = defineEmits(['printReceipt', 'skipReceipt']);

const printReceipt = () => emit('printReceipt');
const skipReceipt = () => emit('skipReceipt');
</script>

<template>
  <div class="receipt-prompt">
    <div class="receipt-prompt__inner">
      <div class="receipt-prompt__header">
        <VButton variant="primary" class="receipt-prompt__btn" @click="goBack">
          <IconArrowLeft />
          Назад
        </VButton>
      </div>
      <img :src="receiptSrc" alt="receipt-icon" width="400" height="400" />
      <div class="receipt-prompt__body">
        <h1 class="receipt-prompt__title">Распечатать чек?</h1>
        <p class="receipt-prompt__subtitle">
          Можете отказаться и помочь природе, если откажитесь от печати
        </p>
      </div>
      <div class="receipt-prompt__actions">
        <VButton
          variant="primary"
          @click="printReceipt"
          class="receipt-prompt__btn"
        >
          Не печатать
        </VButton>
        <VButton
          variant="outline"
          @click="skipReceipt"
          class="receipt-prompt__btn"
        >
          Распечатать
        </VButton>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.receipt-prompt {
  height: 100%;

  &__inner {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 80px;
    text-align: center;
  }

  &__header {
    align-self: flex-start;
    margin-bottom: 80px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__btn {
    font-size: 32px;
    min-width: 320px;
    min-height: 104px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;

    svg {
      width: 40px;
      height: 40px;
    }
  }

  &__title {
    font-size: 64px;
  }

  &__subtitle {
    font-size: 32px;
  }

  &__actions {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 40px;

    button {
      flex: 1;
      padding: 32px 36px;
      font-size: 32px;
    }
  }
}
</style>
