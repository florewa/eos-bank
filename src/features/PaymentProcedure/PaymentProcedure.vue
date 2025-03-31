<script setup lang="ts">
import { VButton } from '@/shared/ui';
import IconArrowLeft from '@/shared/assets/icons/IconArrowLeft.svg';
import picSrc from '@/shared/assets/img/PaymentPic.svg?url';
import mockQr from '@/shared/assets/img/MockQR.svg?url';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const paymentMethod = route.query.method as 'card' | 'sbp' | undefined;

const goBack = () => {
  router.push('/pay-debt');
};
</script>

<template>
  <section class="payment-procedure">
    <div class="payment-procedure__inner">
      <div class="payment-procedure__header">
        <VButton
          variant="primary"
          class="payment-procedure__btn"
          @click="goBack"
        >
          <IconArrowLeft />
          Назад
        </VButton>
      </div>
      <div class="payment-procedure__body">
        <div
          class="payment-procedure__picture"
          :style="{ order: paymentMethod === 'sbp' ? 2 : 0 }"
        >
          <img
            :src="paymentMethod === 'sbp' ? mockQr : picSrc"
            alt="payment image"
            width="400"
            height="400"
          />
        </div>
        <h1
          class="payment-procedure__title"
          :style="{ order: paymentMethod === 'sbp' ? 0 : 1 }"
        >
          {{
            paymentMethod === 'sbp'
              ? 'Оплата через СБП'
              : 'Оплата банковской картой'
          }}
        </h1>
        <div
          class="payment-procedure__subtitle"
          :style="{ order: paymentMethod === 'sbp' ? 1 : 2 }"
        >
          {{
            paymentMethod === 'sbp'
              ? 'Сканируйте QR-код для продолжения оплаты'
              : 'Используйте терминал оплаты'
          }}
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.payment-procedure {
  height: 77vh;

  &__inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__header {
    align-self: flex-start;
  }

  &__body {
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }

  &__picture {
    margin-bottom: 40px;
  }

  &__title {
    font-size: 64px;
  }

  &__subtitle {
    font-size: 32px;
    letter-spacing: 0.01em;
  }

  &__btn {
    font-size: 32px;
    min-width: 320px;
    min-height: 104px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 18px;

    svg {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
