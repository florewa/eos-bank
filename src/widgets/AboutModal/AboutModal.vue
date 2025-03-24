<script setup lang="ts">
import { ref } from 'vue';

import certificateImg from '@/shared/assets/img/certificate.png';
import { VButton } from '@/shared/ui';
import VModal from '@/shared/ui/VModal/VModal.vue';

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
        <div class="modal__title">О компании</div>
        <div class="modal__text">
          ЭОС — современная профессиональная коллекторская организация, которая
          состоит в государственном реестре. Регистрационный номер записи в
          государственном реестре: 13/17/77000-КЛ от 2.02.2017. Деятельность
          компании происходит строго в рамках закона и регулируется Федеральной
          службой судебных приставов. Компания работает уже 16 лет. За это
          время, более 800 000 клиентов закрыли свои долги на комфортных
          условиях.
        </div>
        <div class="modal__picture">
          <img
            :src="certificateImg"
            alt="certificate"
            width="952"
            height="1347"
          />
        </div>
        <div class="modal__action">
          <VButton variant="primary" rounded @click="close">Закрыть</VButton>
        </div>
      </div>
    </div>
  </VModal>
</template>

<style scoped lang="scss">
.modal {
  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 12px;
    letter-spacing: 0.01em;
  }

  &__title {
    font-weight: 700;
    font-size: 40px;
  }

  &__picture {
    margin-block: 36px;
  }

  &__text {
    font-size: 24px;
  }
}
</style>
