<script setup lang="ts">
import { ref } from 'vue';

import { type Contract } from '@/app/assets/mocks/mockContract.ts';
import { ContractInfo, ContractInfoCabinet, DebtCabinetForm } from '@/features';
import PersonalInfo from '@/pages/cabinet-page/ui/PersonalInfo/PersonalInfo.vue';
import TotalDebt from '@/pages/cabinet-page/ui/TotalDebt/TotalDebt.vue';

const isPaymentScreen = ref(false);
const selectedContract = ref<Contract | null>(null);

const showPaymentScreen = (contract: Contract) => {
  selectedContract.value = contract;
  isPaymentScreen.value = true;
};

const hidePaymentScreen = () => {
  isPaymentScreen.value = false;
  selectedContract.value = null;
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
        @back="hidePaymentScreen"
      />
      <DebtCabinetForm />
    </template>
  </div>
</template>

<style scoped lang="scss"></style>
