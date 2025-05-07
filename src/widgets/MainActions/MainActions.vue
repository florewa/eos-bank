<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import IconCards from '@/shared/assets/icons/IconCards.svg';
import IconChecklist from '@/shared/assets/icons/IconChecklist.svg';
import IconDocument from '@/shared/assets/icons/IconDocument.svg';
import IconHuman from '@/shared/assets/icons/IconHuman.svg';
import IconProtectedList from '@/shared/assets/icons/IconProtectedList.svg';
import { VButton, VModal } from '@/shared/ui';

const router = useRouter();

const isBlockedRoute = ref(false);

const actions = [
  { icon: IconHuman, text: 'Узнать о задолженности', path: '/debt-info' },
  { icon: IconDocument, text: 'Оплатить задолженность', path: '/pay-debt' },
  { icon: IconChecklist, text: 'Получить кредит в банке', path: '/get-loan' },
  { icon: IconCards, text: 'Получить деньги на карту', path: '/get-money' },
  { icon: IconProtectedList, text: 'Оформить ОСАГО', path: '/insurance' },
];

const handleClick = (path: string) => {
  // const goalName = `main-action-${path.replace('/', '')}`;
  // window.ym?.(100955373, 'reachGoal', goalName);
  // console.log(`Sent goal to Yandex Metrika: ${goalName}`);

  if (path === '/get-loan' || path === '/get-money' || path === '/insurance') {
    isBlockedRoute.value = true;
  } else {
    router.push(path);
  }
};

const closeModal = () => {
  isBlockedRoute.value = false;
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
  <VModal :is-open="isBlockedRoute" @close="closeModal">
    <div class="modal">
      <div class="modal__title h1">
        Раздел находится <br />
        в разработке
      </div>
      <VButton variant="primary" @click="closeModal">Закрыть</VButton>
    </div>
  </VModal>
</template>

<style scoped lang="scss">
.main-actions {
  min-width: 660px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.modal {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 60px;

  &__title {
    text-align: center;
  }
}
</style>
