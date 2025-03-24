<script setup lang="ts">
import { ref } from 'vue';

import IconMasterCard from '@/shared/assets/icons/IconMasterCard.svg';
import IconMir from '@/shared/assets/icons/IconMir.svg';
import IconSBP from '@/shared/assets/icons/IconSBP.svg?url';
import IconVisa from '@/shared/assets/icons/IconVisa.svg';
import { VButton, VInput } from '@/shared/ui';
import { IDModal } from '@/widgets';

const id = ref('');
const sum = ref('');

const IDModalRef = ref<InstanceType<typeof IDModal> | null>(null);

const openModal = () => {
  if (IDModalRef.value) {
    IDModalRef.value.open();
  }
};
</script>

<template>
  <section class="pay-debt">
    <div class="pay-debt__inner">
      <div class="pay-debt__header">
        <div class="pay-debt__title h1">
          Оплатить задолженность в терминале — легко!
        </div>
        <div class="pay-debt__text">
          Оплатить задолженность можно банковскими картами платежных систем Мир,
          Visa, MasterCard и через СБП.
        </div>
      </div>
      <div class="pay-debt__badge">
        <div class="pay-debt__list">
          <div class="pay-debt__list-item text">
            До 1 часа — поступление платежа в ЭОС
          </div>
          <div class="pay-debt__list-item text">0% комиссия</div>
          <div class="pay-debt__list-item text">Нужен только ID клиента</div>
        </div>
      </div>
      <form class="pay-debt__form">
        <div class="pay-debt__form-inner">
          <div class="pay-debt__form-label">ID Клиента</div>
          <div class="pay-debt__form-label">Сумма платежа (руб.)</div>
          <VInput
            class="pay-debt__form-input"
            v-model="id"
            placeholder="ID Клиента"
            question
            @open-modal="openModal"
          />
          <VInput
            class="pay-debt__form-input"
            v-model="sum"
            placeholder="Сумма платежа (руб.)"
          />
          <VButton
            variant="primary"
            type="button"
            class="pay-debt__button-card"
          >
            Оплатить картой
            <IconMasterCard />
            <IconVisa />
            <IconMir />
          </VButton>
          <VButton variant="outline" type="button" class="pay-debt__button-sbp">
            Оплатить через СБП
            <img :src="IconSBP" alt="" />
          </VButton>
        </div>
      </form>
      <IDModal ref="IDModalRef" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.pay-debt {
  &__inner {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__badge {
    border-radius: 16px;
    padding: 24px;
    background-color: var(--background-colors-light-green2);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__list-item {
    font-weight: 700;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: var(--red-primary);
      border-radius: 50%;
      margin-right: 12px;
    }
  }

  &__form {
    &-inner {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    &-label {
      font-weight: 700;
    }
  }

  &__button-sbp {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__button-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
}
</style>
