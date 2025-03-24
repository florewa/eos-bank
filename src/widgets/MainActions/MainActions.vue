<script setup lang="ts">
import { VButton } from '@/shared/ui';

import IconCards from '@/shared/assets/icons/IconCards.svg';
import IconChecklist from '@/shared/assets/icons/IconChecklist.svg';
import IconDocument from '@/shared/assets/icons/IconDocument.svg';
import IconHuman from '@/shared/assets/icons/IconHuman.svg';
import IconProtectedList from '@/shared/assets/icons/IconProtectedList.svg';

const actions = [
  { icon: IconHuman, text: 'Узнать о задолженности', path: '/debt-info' },
  { icon: IconDocument, text: 'Оплатить задолженность', path: '/pay-debt' },
  { icon: IconChecklist, text: 'Получить кредит в банке', path: '/get-loan' },
  { icon: IconCards, text: 'Получить деньги на карту', path: '/get-money' },
  { icon: IconProtectedList, text: 'Оформить ОСАГО', path: '/insurance' },
];
</script>

<template>
  <div class="main-actions">
    <VButton
      v-for="(action, index) in actions"
      :key="index"
      variant="primary"
      big
    >
      <component :is="action.icon" />
      {{ action.text }}
    </VButton>
  </div>
</template>

<style scoped lang="scss">
.main-actions {
  min-width: 660px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}
</style>
