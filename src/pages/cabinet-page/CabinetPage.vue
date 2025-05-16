<script setup lang="ts">
import { ref, computed } from 'vue';

import { ContractInfo, ContractInfoCabinet, DebtCabinetForm } from '@/features';
import PersonalInfo from '@/pages/cabinet-page/ui/PersonalInfo/PersonalInfo.vue';
import TotalDebt from '@/pages/cabinet-page/ui/TotalDebt/TotalDebt.vue';

import mockUserStatistics from '@/app/assets/mocks/mockUserStatistics.ts';
import mockUserStock from '@/app/assets/mocks/mockContract.ts';

const isPaymentScreen = ref(false);
const selectedContractIndex = ref<number | null>(null);

const debts = mockUserStatistics.result.debts;

const selectedContract = computed(() =>
  selectedContractIndex.value !== null
    ? debts[selectedContractIndex.value]
    : null
);

const selectedPromotions = computed(() =>
  selectedContract.value
    ? mockUserStock.filter(
        (promo) =>
          promo.contract_number === selectedContract.value.contract_number
      )
    : []
);

const showPaymentScreen = (index: number) => {
  selectedContractIndex.value = index;
  isPaymentScreen.value = true;
};

const hidePaymentScreen = () => {
  isPaymentScreen.value = false;
  selectedContractIndex.value = null;
};
</script>

<template>
  <div class="cabinet-page">
    <template v-if="!isPaymentScreen">
      <PersonalInfo />
      <TotalDebt />
      <ContractInfo @pay="showPaymentScreen" />
    </template>

    <template v-else>
      <ContractInfoCabinet
        :contract="selectedContract"
        :promotions="selectedPromotions"
        @back="hidePaymentScreen"
      />
      <DebtCabinetForm />
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
