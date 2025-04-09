<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import ReceiptPrintPrompt from '@/pages/payment-page/ui/ReceiptPrintPrompt/ReceiptPrintPrompt.vue';
import IconArrowLeft from '@/shared/assets/icons/IconArrowLeft.svg';
import mockQr from '@/shared/assets/img/MockQR.svg?url';
import picSrc from '@/shared/assets/img/PaymentPic.svg?url';
import { useGlobalStore } from '@/shared/store/globalStore.ts';
import { VButton } from '@/shared/ui';

const globalStore = useGlobalStore();
const route = useRoute();
const router = useRouter();

const paymentMethod = route.query.method as 'card' | 'sbp' | undefined;
const isPaymentSuccessful = ref(false);

const goBack = () => {
  router.push('/pay-debt');
};

onMounted(() => {
  globalStore.reset();

  setTimeout(() => {
    globalStore.setIsLoading(true);
    console.log('Этап 1: Начало оплаты');

    setTimeout(() => {
      globalStore.setIsLoading(false);
      globalStore.setIsSuccess(true);
      console.log('Этап 2: Оплата завершена');
      isPaymentSuccessful.value = true;
    }, 4000);
  }, 4000);
});
</script>

<template>
  <section class="payment-procedure">
    <div v-if="!isPaymentSuccessful" class="payment-procedure__inner">
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
    <ReceiptPrintPrompt
      v-else
      @printReceipt="console.log('Печатаем чек')"
      @skipReceipt="router.push('/')"
    />
  </section>
</template>

<style scoped lang="scss">
.payment-procedure {
  height: 1475px;

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
