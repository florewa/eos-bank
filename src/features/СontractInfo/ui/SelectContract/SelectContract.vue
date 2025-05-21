<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import IconPromotion from '@/shared/assets/icons/IconPromotion.svg';
import { VButton } from '@/shared/ui';
import { useAuthStore } from '@/features/AccountAuthorization/model';

const authStore = useAuthStore();

const debts = computed(() => authStore.userStatistics?.debts || []);

const selectedContract = ref<number | null>(null);

const emit = defineEmits(['contract-selected', 'contract-deselected']);

const contractPromotions = computed(() => {
  return debts.value.map((contract) => {
    return {
      contract_number: contract.contract_number,
      hasPromotions:
        authStore.userStock?.some(
          (promo) => promo.contract_number === contract.contract_number
        ) || false,
    };
  });
});

const selectContract = (index: number) => {
  if (selectedContract.value === index) {
    selectedContract.value = null;
    emit('contract-deselected');
  } else {
    selectedContract.value = index;
    emit('contract-selected', index);
  }
};

onMounted(() => {
  if (debts.value.length > 0) {
    selectedContract.value = 0;
    emit('contract-selected', 0);
  }
});
</script>

<template>
  <div class="select-contract">
    <div class="select-contract__body">
      <div class="select-contract__list">
        <div
          v-for="(contract, index) in debts"
          :key="index"
          class="select-contract__list-item"
        >
          <div
            class="select-contract__list-item__name"
            :class="{ fw700: selectedContract === index }"
          >
            Договор <span>№{{ contract.contract_number }}</span>
            <IconPromotion v-if="contractPromotions[index]?.hasPromotions" />
          </div>
          <div class="select-contract__list-item__action">
            <VButton
              :variant="selectedContract === index ? 'primary' : 'outline'"
              @click="selectContract(index)"
            >
              {{ selectedContract === index ? 'Выбрано' : 'Выбрать' }}
            </VButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.select-contract {
  &__body {
    background: var(--background-colors-light-green2);
    border-radius: 16px;
    padding: 24px;
  }

  &__list {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 290px;
    overflow-y: auto;
    padding-right: 12px;

    &::-webkit-scrollbar {
      width: 28px;
    }

    &::-webkit-scrollbar-thumb {
      background: #cad4d5;
      border-radius: 16px;
      border: 4px solid transparent;
      background-clip: padding-box;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
      border: 4px solid transparent;
      background-clip: padding-box;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
      margin-right: 12px;
    }

    &-item {
      background: var(--white);
      border-radius: 16px;
      padding: 16px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__name {
        display: flex;
        align-items: center;
        gap: 8px;

        svg {
          color: var(--red-third);
          margin-left: 8px;
        }
      }

      button {
        width: 137px;
        padding: 12px 24px;
        border-radius: 8px;
      }
    }

    .fw700 {
      font-weight: 700;
    }
  }
}
</style>
