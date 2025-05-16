<script setup lang="ts">
import { ref, computed } from 'vue';

import mockUserStatistics from '@/app/assets/mocks/mockUserStatistics.ts';

const isBlurred = ref(true);

const toggleBlur = () => {
  isBlurred.value = !isBlurred.value;
};

const debts = mockUserStatistics.result.debts;

const totalContracts = computed(() => debts.length);

const totalDebt = computed(() => {
  return (
    debts
      .reduce((sum, debt) => {
        const amount = parseFloat(
          debt.debt_fnc_amount.replace(/\s/g, '').replace(',', '.')
        );
        return sum + amount;
      }, 0)
      .toLocaleString('ru-RU', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' ₽'
  );
});
</script>

<template>
  <section class="total-debt">
    <div class="total-debt__inner">
      <div class="total-debt__content">
        <h1 class="total-debt__title h1">Общая сумма задолженности</h1>
        <div class="total-debt__subtitle h2">
          По <span>{{ totalContracts }}</span> договорам
        </div>
      </div>
      <div class="total-debt__content">
        <div
          class="total-debt__debt h1"
          :class="{ 'is-blurred': isBlurred }"
          @click="toggleBlur"
        >
          {{ totalDebt }}
        </div>
        <div class="total-debt__hint">
          Нажмите на сумму, чтобы узнать сумму задолженности
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.total-debt {
  &__inner {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 6px;

    span {
      color: var(--red-accent);
    }
  }

  &__debt {
    color: var(--red-accent);
    position: relative;
    cursor: pointer;
    padding: 18px;
    transition:
      filter 0.3s ease,
      background 0.3s ease;
    user-select: none;

    &.is-blurred {
      filter: blur(11px);
      background: rgba(255, 255, 255, 0.5);
    }

    &:not(.is-blurred) {
      filter: blur(0px);
      background: transparent;
    }
  }

  &__hint {
    color: var(--red-secondary);
  }
}
</style>
