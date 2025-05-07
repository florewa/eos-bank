<script setup lang="ts">
import { onMounted, ref, computed, defineProps } from 'vue';
import { useRouter } from 'vue-router';

import ReceiptPrintPrompt from '@/pages/payment-page/ui/ReceiptPrintPrompt/ReceiptPrintPrompt.vue';
import IconArrowLeft from '@/shared/assets/icons/IconArrowLeft.svg';
import mockQr from '@/shared/assets/img/MockQR.svg?url';
import picSrc from '@/shared/assets/img/PaymentPic.svg?url';
import { useGlobalStore } from '@/shared/store/globalStore.ts';
import { VButton } from '@/shared/ui';
import {
  paymentEvent,
  type PaymentItem,
  checkClient,
  changeKKTStatus,
} from '@/features/PaymentProcedure/model/api.ts';

const props = defineProps<{
  clientId: string;
  amount: string;
  method: 'card' | 'sbp' | null;
}>();

const globalStore = useGlobalStore();
const router = useRouter();

const isPaymentSuccessful = ref(false);
const paymentError = ref<string | null>(null);

const goBack = () => {
  if (props.method || props.clientId) {
    router.push('/pay-debt');
  } else {
    router.push('/');
  }
};

const handleCardPayment = async (clientId: string, amountNumber: number) => {
  try {
    const paymentData: PaymentItem[] = [
      {
        title: `Оплата задолженности клиента ${clientId}`,
        count: 1,
        price: amountNumber,
      },
    ];

    const response = await paymentEvent(paymentData);

    if (response.result === 'success') {
      isPaymentSuccessful.value = true;
      globalStore.setIsSuccess(true);

      if (response.description === 'paper_status=false') {
        try {
          const terminalId = window.TERMINAL_ID;
          await changeKKTStatus(terminalId);
        } catch (statusError) {
          console.error('Ошибка при вызове changePaperStatus:', statusError);
        }
      }
    } else {
      paymentError.value = `Платеж не удался (API: ${response.result}).`;
      globalStore.setIsError(true);
    }
  } catch (error) {
    console.error('Ошибка при вызове paymentEvent:', error);
    paymentError.value =
      error instanceof Error
        ? error.message
        : 'Произошла неизвестная ошибка при оплате.';
    globalStore.setIsError(true);
  }
};

onMounted(async () => {
  globalStore.reset();

  if (!props.clientId) {
    paymentError.value = 'ID клиента не указан.';
    globalStore.setIsError(true);
    return;
  }

  let priceAmount: number | undefined;
  if (props.method === 'card') {
    if (!props.amount) {
      paymentError.value = 'Сумма для оплаты не указана.';
      globalStore.setIsError(true);
      return;
    }
    priceAmount = parseFloat(props.amount);
    if (isNaN(priceAmount) || priceAmount <= 0) {
      paymentError.value = 'Некорректная сумма для оплаты.';
      globalStore.setIsError(true);
      return;
    }
  }

  try {
    const canClientPay = await checkClient(props.clientId);

    if (!canClientPay) {
      paymentError.value = `Оплата для клиента ${props.clientId} невозможна (клиент заблокирован или отсутствует).`;
      globalStore.setIsError(true);
      return;
    }

    if (props.method === 'card' && priceAmount !== undefined) {
      await handleCardPayment(props.clientId, priceAmount);
    } else if (props.method === 'sbp') {
    } else if (!props.method) {
      paymentError.value = 'Метод оплаты не выбран.';
      globalStore.setIsError(true);
    }
  } catch (error) {
    console.error('Ошибка при проверке клиента:', error);
    paymentError.value =
      error instanceof Error
        ? error.message
        : 'Произошла ошибка при проверке статуса клиента.';
    globalStore.setIsError(true);
  }
});

const pageTitle = computed(() => {
  if (props.method === 'sbp') {
    return 'Оплата через СБП';
  }
  if (props.method === 'card') {
    return isPaymentSuccessful.value
      ? 'Оплата прошла успешно'
      : 'Оплата банковской картой';
  }
  return 'Процесс оплаты';
});

const pageSubtitle = computed(() => {
  if (props.method === 'sbp') {
    return 'Сканируйте QR-код для продолжения оплаты';
  }
  if (props.method === 'card') {
    return isPaymentSuccessful.value
      ? `Сумма: ${props.amount || 'N/A'} руб. Клиент ID: ${props.clientId || 'N/A'}`
      : 'Используйте терминал оплаты';
  }
  return 'Пожалуйста, подождите';
});

const displayImage = computed(() => {
  return props.method === 'sbp' ? mockQr : picSrc;
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
          :style="{ order: props.method === 'sbp' ? 2 : 0 }"
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
          :style="{ order: props.method === 'sbp' && !paymentError ? 0 : 1 }"
        >
          {{ pageTitle }}
        </h1>
        <div
          class="payment-procedure__subtitle"
          :style="{ order: props.method === 'sbp' && !paymentError ? 1 : 2 }"
        >
          {{ pageSubtitle }}
        </div>
      </div>
    </div>
    <ReceiptPrintPrompt
      v-else
      :amount="props.amount ? parseFloat(props.amount) : undefined"
      :client-id="props.clientId"
      @printReceipt="
        console.log(
          'Печатаем чек для ID:',
          props.clientId,
          'на сумму:',
          props.amount
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

  &__error {
    color: var(--red-primary, #d32f2f);
    font-size: 24px;
    margin-top: 20px;
  }
}
</style>
