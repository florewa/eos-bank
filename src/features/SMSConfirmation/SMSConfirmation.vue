<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

import SmsCodeInput from '@/features/SMSConfirmation/ui/SmsCodeInput.vue';
import IconBack from '@/shared/assets/icons/IconArrowLeft.svg';
import { VButton } from '@/shared/ui';

const props = defineProps<{
  phone: string;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'resend'): void;
}>();

const router = useRouter();
const smsCode = ref(['', '', '', '', '', '']);
const timer = ref(59);
const isTimerActive = ref(true);
const error = ref<string | null>(null);

const numpadMethods = ref<
  | {
      setActiveInput: (input: HTMLInputElement | null) => void;
    }
  | undefined
>();

const setNumpadMethods = (methods: {
  setActiveInput: (input: HTMLInputElement | null) => void;
}) => {
  numpadMethods.value = methods;
};

const maskedPhone = computed(() => {
  const phoneStr = String(props.phone).replace(/\D/g, '');
  if (phoneStr.length < 2) return props.phone;
  const lastTwoDigits = phoneStr.slice(-2);
  return `+7 *** *** ** ${lastTwoDigits}`;
});

let intervalId: ReturnType<typeof setInterval> | null = null;

const startTimer = () => {
  intervalId = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      isTimerActive.value = false;
      clearInterval(intervalId!);
      intervalId = null;
    }
  }, 1000);
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});

const toBack = () => {
  document.dispatchEvent(new Event('hideNumpad'));
  emit('back');
};

const submitCode = () => {
  const codeStr = smsCode.value.join('');
  if (codeStr === '111111') {
    error.value = null;
    document.dispatchEvent(new Event('hideNumpad'));
    router.push('/cabinet');
  } else {
    error.value = 'Неверный код';
  }
};

const resendCode = () => {
  if (!isTimerActive.value) {
    timer.value = 59;
    isTimerActive.value = true;
    startTimer();
    emit('resend');
    smsCode.value = ['', '', '', '', '', ''];
    error.value = null;
  }
};

defineExpose({
  setNumpadMethods,
});
</script>

<template>
  <section class="sms-code">
    <div class="sms-code__inner">
      <div class="sms-code__header">
        <VButton variant="primary" @click="toBack">
          <IconBack />
          Назад
        </VButton>
      </div>
      <h1 class="sms-code__title">Введите код из SMS</h1>
      <div class="sms-code__text text">
        СМС-сообщение отправлено на номер <b>{{ maskedPhone }}</b>
      </div>
      <SmsCodeInput
        v-model:code="smsCode"
        @submit="submitCode"
        :numpad-methods="numpadMethods"
        :error="error"
      />
      <div class="sms-code__repeat-action">
        <span v-if="isTimerActive">
          Выслать код повторно через {{ timer }} секунд
        </span>
        <button v-else @click="resendCode" class="resend-button">
          Выслать код повторно
        </button>
      </div>
      <div class="sms-code__help">
        <span>8 (800) 555-17-10</span>
        Звонок по России бесплатный.
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.sms-code {
  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 40px;
  }

  &__header {
    align-self: flex-start;

    button {
      width: 164px;
      display: flex;
      gap: 10px;
      align-items: center;
      justify-content: center;
    }
  }

  &__title {
    margin-bottom: -20px;
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  &__repeat-action {
    font-weight: 700;
    text-decoration: underline;
    text-decoration-skip-ink: none;

    .resend-button {
      background: none;
      border: none;
      padding: 0;
      font: inherit;
      color: inherit;
      text-decoration: underline;
      cursor: pointer;
    }
  }

  &__help {
    letter-spacing: 0.01em;
    display: flex;
    gap: 12px;

    span {
      font-weight: 700;
      color: var(--red-accent);
    }
  }

  &__buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
}
</style>
