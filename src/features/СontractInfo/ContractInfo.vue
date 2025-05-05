<script setup lang="ts">
import { computed, ref } from 'vue';

import mockContracts from '@/app/assets/mocks/mockContract.ts';
import SelectContract from '@/features/СontractInfo/ui/SelectContract/SelectContract.vue';
import IconInfo from '@/shared/assets/icons/IconInfo2.svg';
import { VButton } from '@/shared/ui';
import { PromotionsModal } from '@/widgets';

const isContractSelected = ref(false);
const selectedContractIndex = ref<number | null>(null);

const emit = defineEmits(['pay']);

const handleContractSelected = (index: number) => {
  isContractSelected.value = true;
  selectedContractIndex.value = index;
};

const handleContractDeselected = () => {
  isContractSelected.value = false;
  selectedContractIndex.value = null;
};

const selectedContract = computed(() =>
  selectedContractIndex.value !== null
    ? mockContracts[selectedContractIndex.value]
    : null
);

const PromotionsModalRef = ref<InstanceType<typeof PromotionsModal> | null>(
  null
);

const openModal = () => {
  if (PromotionsModalRef.value) {
    PromotionsModalRef.value.open();
  }
};

const goToPayment = () => {
  if (selectedContract.value) {
    emit('pay', selectedContract.value);
  }
};
</script>

<template>
  <section class="contract-info">
    <div class="contract-info__inner">
      <div class="contract-info__content">
        <h1 class="contract-info__inner__title">Договор</h1>
        <SelectContract
          @contract-selected="handleContractSelected"
          @contract-deselected="handleContractDeselected"
        />
      </div>
      <div
        v-if="isContractSelected && selectedContract"
        class="contract-info__content"
      >
        <div class="contract-info__title h1">Информация о договоре</div>
        <div class="contract-info__row">
          <div class="contract-info__item">
            Номер договора: <b>{{ selectedContract.contractNumber }}</b>
          </div>
          <div class="contract-info__item">
            ID должника: <b>{{ selectedContract.debtorId }}</b>
          </div>
          <div class="contract-info__item">
            Сумма задолженности: <b>{{ selectedContract.debtAmount }}</b>
          </div>
        </div>
        <div class="contract-info__row">
          <div class="contract-info__item">
            Название банка: <b>{{ selectedContract.bankName }}</b>
          </div>
          <div class="contract-info__item">
            Дата заключения договора: <b>{{ selectedContract.contractDate }}</b>
          </div>
          <div class="contract-info__item">
            Акции: <span>{{ selectedContract.promotions.length }}</span>
            <IconInfo
              v-if="selectedContract.promotions.length > 0"
              @click="openModal"
            />
          </div>
        </div>
        <div class="contract-info__row">
          <div class="contract-info__item">
            Остаток задолженности:
            <span>{{ selectedContract.remainingDebt }}</span>
          </div>
        </div>
      </div>
      <VButton
        v-if="isContractSelected"
        variant="primary"
        class="contract-info__btn"
        @click="goToPayment"
      >
        Оплатить
      </VButton>
      <PromotionsModal
        full-width
        ref="PromotionsModalRef"
        :promotions="selectedContract?.promotions || []"
      />
    </div>
  </section>
</template>

<style scoped lang="scss">
.contract-info {
  max-height: 830px;

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__row {
    display: flex;
    gap: 20px;
  }

  &__item {
    display: flex;
    gap: 12px;
    align-items: center;

    svg {
      margin-left: 12px;
      color: var(--red-third);
      cursor: pointer;
    }

    span {
      font-weight: 700;
      color: var(--red-accent);
    }
  }

  &__subtitle {
    font-weight: 600;
    margin-top: 20px;
  }

  &__promotions {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__promotion {
    background: #f5f5f5;
    padding: 10px;
    border-radius: 8px;
  }

  button {
    max-width: 166px;
  }
}
</style>
