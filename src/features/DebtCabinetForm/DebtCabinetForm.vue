<script setup lang="ts">
import { VButton, VInput } from '@/shared/ui';
import { ref } from 'vue';
import IconVisa from '@/shared/assets/icons/IconVisa.svg';
import IconMasterCard from '@/shared/assets/icons/IconMasterCard.svg';
import IconMir from '@/shared/assets/icons/IconMir.svg';
import IconSBP from '@/shared/assets/icons/IconSBP.svg?url';
import picSrc from '@/shared/assets/img/GirlWithCard.svg?url';

const sum = ref('');
</script>

<template>
  <section class="debt-form">
    <div class="debt-form__inner">
      <div class="debt-form__picture">
        <img :src="picSrc" alt="" />
      </div>
      <div class="debt-form__content">
        <h1 class="debt-form__title">Оплата задолженности</h1>
        <div class="debt-form__text text">
          Оплатить задолженность можно банковскими картами платежных систем Мир,
          Visa, MasterCard и через СБП.
        </div>
      </div>
      <form class="debt-form__form">
        <div class="debt-form__form-label">Сумма платежа (руб.)</div>
        <VInput
          v-model="sum"
          placeholder="Сумма платежа (руб.)"
          class="debt-form__form-input"
        />
        <div class="debt-form__form-actions">
          <VButton
            variant="primary"
            type="button"
            class="debt-form__button-card"
          >
            Оплатить картой
            <IconMasterCard />
            <IconVisa />
            <IconMir />
          </VButton>
          <VButton
            variant="outline"
            type="button"
            class="debt-form__button-sbp"
          >
            Оплатить через СБП
            <img :src="IconSBP" alt="" />
          </VButton>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.debt-form {
  position: relative;

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__picture {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &-label {
      font-weight: 700;
    }

    &-input {
      max-width: 442px;
    }

    &-actions {
      display: flex;
      gap: 20px;
    }
  }

  &__button-sbp {
    width: 331px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__button-card {
    width: 394px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
}
</style>
