<script setup lang="ts">
import { onMounted, ref, computed, defineProps, watch } from 'vue';
import { useRouter } from 'vue-router';
import QRCode from 'qrcode';

import ReceiptPrintPrompt from '@/pages/payment-page/ui/ReceiptPrintPrompt/ReceiptPrintPrompt.vue';
import IconArrowLeft from '@/shared/assets/icons/IconArrowLeft.svg';
import loaderSrc from '@/shared/assets/img/Loader.svg?url';
import picSrc from '@/shared/assets/img/PaymentPic.svg?url';
import { useGlobalStore } from '@/shared/store/globalStore.ts';
import { VButton } from '@/shared/ui';
import {
  paymentEvent,
  type PaymentItem,
  checkClient,
  changeKKTStatus,
  getPaymentQr,
  type GetPaymentQrParams,
  sendPaymentConfirmation,
} from '@/features/PaymentProcedure/model/api.ts';

const props = defineProps<{
  clientId: string;
  amount: string;
  method: 'card' | 'sbp' | null;
  from?: string;
}>();

const globalStore = useGlobalStore();
const router = useRouter();

const isPaymentSuccessful = ref(false);
const paymentError = ref<string | null>(null);
const paymentQrCodeUrl = ref<string | null>(null);
const sbpLoading = ref<boolean>(false);

const qrImage = ref<string | null>(null);

const goBack = () => {
  const fromCabinet = router.currentRoute.value.query.from === 'cabinet';

  if (fromCabinet) {
    router.push('/cabinet');
  } else if (props.method || props.clientId || !props.from) {
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

      try {
        const terminalID = window.TERMINAL_ID;
        await sendPaymentConfirmation({
          terminalId: terminalID,
          ceid: clientId,
          price: amountNumber,
        });

        console.log('Платеж успешно подтвержден на бэкенде');
      } catch (confirmationError) {
        console.error('Ошибка при подтверждении платежа:', confirmationError);
      }
    } else {
      paymentError.value = `Платеж не удался (API: ${response.result}). Детали: ${response.description}`;
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

const handleSbpPayment = async (clientId: string, amountStr: string) => {
  sbpLoading.value = true;
  paymentError.value = null;
  paymentQrCodeUrl.value = null;

  if (!amountStr) {
    paymentError.value = 'Сумма для оплаты СБП не указана.';
    globalStore.setIsError(true);
    sbpLoading.value = false;
    return;
  }

  const amountInRub = parseFloat(amountStr);
  if (isNaN(amountInRub)) {
    paymentError.value = 'Некорректная сумма для оплаты СБП.';
    globalStore.setIsError(true);
    sbpLoading.value = false;
    return;
  }

  if (amountInRub < 10) {
    paymentError.value =
      'Минимальная сумма операции через СБП составляет 10 рублей.';
    globalStore.setIsError(true);
    sbpLoading.value = false;
    return;
  }

  const amountInKopecks = Math.round(amountInRub * 100);

  try {
    const qrParams: GetPaymentQrParams = {
      ceid: clientId,
      amount: amountInKopecks,
    };

    // if (window.TERMINAL_CONFIG?.typePlatform) {
    //   qrParams.typePlatform = window.TERMINAL_CONFIG.typePlatform;
    // }
    // if (window.TERMINAL_CONFIG?.yaClientId) {
    //   qrParams.ya_client_id = window.TERMINAL_CONFIG.yaClientId;
    // }

    const qrData = await getPaymentQr(qrParams);
    paymentQrCodeUrl.value = qrData.sbp;
  } catch (error) {
    console.error('Ошибка при получении QR-кода СБП:', error);
    paymentError.value =
      error instanceof Error
        ? error.message
        : 'Произошла ошибка при получении QR-кода для оплаты СБП.';
    globalStore.setIsError(true);
  } finally {
    sbpLoading.value = false;
  }
};

onMounted(async () => {
  globalStore.reset();

  if (!props.clientId) {
    paymentError.value = 'ID клиента не указан.';
    globalStore.setIsError(true);
    return;
  }

  try {
    const canClientPay = await checkClient(props.clientId);
    if (!canClientPay) {
      paymentError.value = `Оплата для клиента ${props.clientId} невозможна (клиент заблокирован или отсутствует).`;
      globalStore.setIsError(true);
      return;
    }
  } catch (error) {
    console.error('Ошибка при проверке клиента:', error);
    paymentError.value =
      error instanceof Error
        ? error.message
        : 'Произошла ошибка при проверке статуса клиента.';
    globalStore.setIsError(true);
    return;
  }

  if (props.method === 'card') {
    if (!props.amount) {
      paymentError.value = 'Сумма для оплаты не указана.';
      globalStore.setIsError(true);
      return;
    }
    const priceAmount = parseFloat(props.amount);
    if (isNaN(priceAmount) || priceAmount <= 0) {
      paymentError.value = 'Некорректная сумма для оплаты.';
      globalStore.setIsError(true);
      return;
    }
    await handleCardPayment(props.clientId, priceAmount);
  } else if (props.method === 'sbp') {
    await handleSbpPayment(props.clientId, props.amount);
  } else if (!props.method) {
    paymentError.value = 'Метод оплаты не выбран.';
    globalStore.setIsError(true);
  }
});

const pageTitle = computed(() => {
  if (props.method === 'sbp') {
    return 'Оплата через СБП';
  }
  if (props.method === 'card') {
    return 'Оплата банковской картой';
  }
  return 'Процесс оплаты';
});

const pageSubtitle = computed(() => {
  if (props.method === 'sbp') {
    return 'Сканируйте QR-код для продолжения оплаты';
  }
  if (props.method === 'card') {
    return 'Используйте терминал оплаты';
  }
  return '';
});

watch(paymentQrCodeUrl, (newValue) => {
  if (newValue) {
    QRCode.toDataURL(newValue, { width: 400 }, (err, url) => {
      if (!err) {
        qrImage.value = url;
      } else {
        console.error('Ошибка при генерации QR:', err);
        qrImage.value = null;
      }
    });
  } else {
    qrImage.value = null;
  }
});

const displayImage = computed(() => {
  if (props.method === 'sbp') {
    if (qrImage.value && !paymentError.value && !sbpLoading.value) {
      return qrImage.value;
    }
    return null;
  }
  return picSrc;
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
        <h1
          class="payment-procedure__title"
          :style="{
            order:
              props.method === 'sbp' && !paymentError && !sbpLoading ? 0 : 1,
          }"
        >
          {{ pageTitle }}
        </h1>
        <div
          class="payment-procedure__subtitle"
          :style="{
            order:
              props.method === 'sbp' && !paymentError && !sbpLoading ? 1 : 2,
          }"
        >
          {{ pageSubtitle }}
        </div>
        <div
          class="payment-procedure__picture"
          :style="{
            order:
              props.method === 'sbp' && !paymentError && !sbpLoading ? 2 : 0,
          }"
        >
          <div
            v-if="props.method === 'sbp' && sbpLoading"
            class="payment-procedure__qr-loader"
          >
            <img
              :src="loaderSrc"
              width="128"
              height="128"
              alt="Загрузка..."
              class="payment-procedure__loader-img"
            />
          </div>
          <div
            v-else-if="displayImage"
            style="background-color: #faf5f7; border-radius: 30px; width: 400px"
          >
            <img
              :src="displayImage"
              alt="payment visualization"
              style="mix-blend-mode: multiply"
              width="400"
              height="400"
            />
          </div>
        </div>
      </div>
    </div>
    <ReceiptPrintPrompt
      v-else
      :amount="props.amount ? parseFloat(props.amount) : undefined"
      :client-id="props.clientId"
      @printReceipt="
        () => {
          router.push('/');
        }
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

  &__loader-img {
    animation: spin 1s linear infinite;
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

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
