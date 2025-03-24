<script setup lang="ts">
import { ref } from 'vue';

import lk1 from '@/shared/assets/img/lk-1.svg?url';
import lk2 from '@/shared/assets/img/lk-2.svg?url';
import lk3 from '@/shared/assets/img/lk-3.svg?url';
import lk4 from '@/shared/assets/img/lk-4.svg?url';
import { VButton, VModal } from '@/shared/ui';

const isOpen = ref(false);

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

defineExpose({ open });
</script>

<template>
  <VModal :is-open="isOpen" @close="close">
    <div class="modal">
      <div class="modal__inner">
        <div class="modal__title">
          Что Вы можете сделать в Личном кабинете прямо сейчас
        </div>
        <div class="modal__body">
          <div class="modal__body-item">
            <img :src="lk1" alt="" width="80" height="80" /> Уточнить остаток
            задолженности
          </div>
          <div class="modal__body-item">
            <img :src="lk2" alt="" width="80" height="80" />
            Узнать о наличии действующих акций
          </div>
          <div class="modal__body-item">
            <img :src="lk3" alt="" width="80" height="80" />
            Оплатить задолженность без комиссии
          </div>
          <div class="modal__body-item">
            <img :src="lk4" alt="" width="80" height="80" />
            Узнать детали кредитного договора
          </div>
        </div>
        <div class="modal__actions">
          <VButton variant="outline" @click="close">Закрыть</VButton>
          <VButton variant="primary" @click="close"
            >Войти в личный кабинет
          </VButton>
        </div>
      </div>
    </div>
  </VModal>
</template>

<style scoped lang="scss">
.modal {
  padding: 20px;

  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    text-align: center;
    gap: 24px;
    letter-spacing: 0.01em;
  }

  &__title {
    font-weight: 700;
    font-size: 40px;
    text-align: left;
  }

  &__body {
    display: grid;
    grid-template-columns: repeat(3, 288px);
    column-gap: 20px;
    row-gap: 24px;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      text-align: left;

      img {
        margin-bottom: 24px;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 20px;
    margin-top: 24px;
    align-self: flex-end;
  }
}
</style>
