<script setup lang="ts">
import { computed, ref } from 'vue';

import SelectContract from '@/features/СontractInfo/ui/SelectContract/SelectContract.vue';
import IconInfo from '@/shared/assets/icons/IconInfo2.svg';
import { VButton } from '@/shared/ui';
import { PromotionsModal } from '@/widgets';

import { useAuthStore } from '@/features/AccountAuthorization/model';

const authStore = useAuthStore();
const debts = computed(() => authStore.userStatistics?.debts || []);

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
    ? debts.value[selectedContractIndex.value]
    : null
);

const promotions = computed(() => {
  if (!selectedContract.value) return [];
  return (
    authStore.userStock?.filter(
      (promo) =>
        promo.contract_number === selectedContract.value!.contract_number
    ) || []
  );
});

const PromotionsModalRef = ref<InstanceType<typeof PromotionsModal> | null>(
  null
);

const openModal = () => {
  if (PromotionsModalRef.value) {
    PromotionsModalRef.value.open();
  }
};

const goToPayment = () => {
  if (selectedContractIndex.value !== null) {
    emit('pay', selectedContractIndex.value);
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
            Номер договора: <b>{{ selectedContract.contract_number }}</b>
          </div>
          <div class="contract-info__item">
            ID должника: <b>{{ selectedContract.ceid }}</b>
          </div>
          <div class="contract-info__item">
            Сумма задолженности: <b>{{ selectedContract.debt_fnc_amount }}</b>
          </div>
        </div>
        <div class="contract-info__row">
          <div class="contract-info__item">
            Название банка: <b>{{ selectedContract.bank_name }}</b>
          </div>
          <div class="contract-info__item">
            Дата заключения договора:
            <b>{{ selectedContract.contract_date }}</b>
          </div>
          <div class="contract-info__item">
            Акции: <span>{{ promotions.length }}</span>
            <IconInfo v-if="promotions.length > 0" @click="openModal" />
          </div>
        </div>
        <div class="contract-info__row">
          <div class="contract-info__item">
            Остаток задолженности:
            <span>{{ selectedContract.debt_fnc_balance }}</span>
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
        :promotions="promotions"
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
    position: relative;

    svg {
      position: absolute;
      right: -40px;
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
