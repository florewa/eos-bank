<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

import type { Contract } from '@/app/assets/mocks/mockContract.ts';
import IconArrowLeft from '@/shared/assets/icons/IconArrowLeft.svg';
import { VButton } from '@/shared/ui';

defineProps<{
  contract: Contract | null;
}>();

const emit = defineEmits(['back']);

const hidePaymentScreen = () => {
  emit('back');
};
</script>

<template>
  <section class="pay-debt">
    <div class="pay-debt__inner">
      <div class="pay-debt__header">
        <VButton variant="primary" class="pay-debt" @click="hidePaymentScreen">
          <IconArrowLeft />
          Назад
        </VButton>
        <h1 class="pay-debt__title">Договор №{{ contract?.contractNumber }}</h1>
      </div>
      <div class="pay-debt__content">
        <div class="pay-debt__title h1">Информация о договоре</div>
        <div class="pay-debt__row">
          <div class="pay-debt__content-item">
            Номер договора: <b>{{ contract?.contractNumber }}</b>
          </div>
          <div class="pay-debt__content-item">
            ID должника: <b>{{ contract?.debtorId }}</b>
          </div>
          <div class="pay-debt__content-item">
            Сумма задолженности: <b>{{ contract?.debtAmount }}</b>
          </div>
        </div>
        <div class="pay-debt__row">
          <div class="pay-debt__content-item">
            Остаток задолженности: <span>{{ contract?.remainingDebt }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pay-debt {
  &__inner {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__header {
    display: flex;
    gap: 20px;
    align-items: center;

    button {
      width: 164px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &-item {
      display: flex;
      gap: 12px;
      align-items: center;

      span {
        font-weight: 700;
        color: var(--red-accent);
      }
    }
  }

  &__row {
    display: flex;
    gap: 20px;
  }
}
</style>
