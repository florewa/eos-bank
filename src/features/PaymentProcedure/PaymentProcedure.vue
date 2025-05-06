<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
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

const paymentMethodFromQuery = computed(
  () => route.query.method as 'card' | 'sbp' | undefined
);
const paymentResultFromQuery = computed(
  () => route.query.result as 'success' | undefined
);
const amountFromQuery = computed(
  () => route.query.amount as string | undefined
);
const clientIdFromQuery = computed(
  () => route.query.clientId as string | undefined
);

const isPaymentSuccessful = ref(false);

const goBack = () => {
  if (paymentMethodFromQuery.value || clientIdFromQuery.value) {
    router.push('/pay-debt');
  } else {
    router.push('/');
  }
};

onMounted(() => {
  globalStore.reset();
  if (
    paymentMethodFromQuery.value === 'card' &&
    paymentResultFromQuery.value === 'success'
  ) {
    isPaymentSuccessful.value = true;
    globalStore.setIsSuccess(true);
  } else if (
    paymentMethodFromQuery.value === 'card' &&
    paymentResultFromQuery.value !== 'success'
  ) {
    console.log(
      'Карточный платеж не подтвержден как успешный через query параметры.'
    );
  }
});

const pageTitle = computed(() => {
  if (paymentMethodFromQuery.value === 'sbp') {
    return 'Оплата через СБП';
  }
  if (paymentMethodFromQuery.value === 'card') {
    return isPaymentSuccessful.value
      ? 'Оплата прошла успешно'
      : 'Оплата банковской картой';
  }
  return 'Процесс оплаты';
});

const pageSubtitle = computed(() => {
  if (paymentMethodFromQuery.value === 'sbp') {
    return 'Сканируйте QR-код для продолжения оплаты';
  }
  if (paymentMethodFromQuery.value === 'card') {
    return isPaymentSuccessful.value
      ? `Сумма: ${amountFromQuery.value || 'N/A'} руб. Клиент ID: ${clientIdFromQuery.value || 'N/A'}`
      : 'Используйте терминал оплаты';
  }
  return 'Пожалуйста, подождите';
});

const displayImage = computed(() => {
  return paymentMethodFromQuery.value === 'sbp' ? mockQr : picSrc;
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
          :style="{ order: paymentMethodFromQuery === 'sbp' ? 2 : 0 }"
        >
          <img
            :src="displayImage"
            alt="payment image"
            width="400"
            height="400"
          />
        </div>
        <h1
          class="payment-procedure__title"
          :style="{ order: paymentMethodFromQuery === 'sbp' ? 0 : 1 }"
        >
          {{ pageTitle }}
        </h1>
        <div
          class="payment-procedure__subtitle"
          :style="{ order: paymentMethodFromQuery === 'sbp' ? 1 : 2 }"
        >
          {{ pageSubtitle }}
        </div>
      </div>
    </div>
    <ReceiptPrintPrompt
      v-else
      :amount="amountFromQuery ? parseFloat(amountFromQuery) : undefined"
      :client-id="clientIdFromQuery"
      @printReceipt="
        console.log(
          'Печатаем чек для ID:',
          clientIdFromQuery,
          'на сумму:',
          amountFromQuery
        )
      "
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
