<script setup lang="ts">
import { useRouter } from 'vue-router';

import IconCards from '@/shared/assets/icons/IconCards.svg';
import IconChecklist from '@/shared/assets/icons/IconChecklist.svg';
import IconDocument from '@/shared/assets/icons/IconDocument.svg';
import IconHuman from '@/shared/assets/icons/IconHuman.svg';
import IconProtectedList from '@/shared/assets/icons/IconProtectedList.svg';
import { VButton } from '@/shared/ui';
import { getCurrentInstance } from 'vue';

const app = getCurrentInstance();
const metrika = app?.appContext.config.globalProperties.$metrika;

const router = useRouter();

const actions = [
  { icon: IconHuman, text: 'Узнать о задолженности', path: '/debt-info' },
  { icon: IconDocument, text: 'Оплатить задолженность', path: '/pay-debt' },
  { icon: IconChecklist, text: 'Получить кредит в банке', path: '/get-loan' },
  { icon: IconCards, text: 'Получить деньги на карту', path: '/get-money' },
  { icon: IconProtectedList, text: 'Оформить ОСАГО', path: '/insurance' },
];

const handleClick = (path: string) => {
  const goalName = `main-action-${path.replace('/', '')}`; // Например, "main-action-debt-info"
  metrika?.('12345678', 'reachGoal', goalName); // Отправляем цель в Метрику
  console.log(`Sent goal to Yandex Metrika: ${goalName}`); // Для отладки
  router.push(path); // Переход по маршруту
};
</script>

<template>
  <div class="main-actions">
    <VButton
      v-for="(action, index) in actions"
      :key="index"
      variant="primary"
      @click="handleClick(action.path)"
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
