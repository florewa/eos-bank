<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue';
import SmsCodeInput from '@/features/SMSConfirmation/ui/SmsCodeInput.vue';
import IconBack from '@/shared/assets/icons/IconArrowLeft.svg';
import { VButton } from '@/shared/ui';
import { sendSMS, checkSMS } from '@/features/SMSConfirmation/model';
import { useAuthStore } from '@/features/AccountAuthorization/model/store';
import { getUserInfo, getUserStatistics, getUserStock } from '@/entities/user';
import { useGlobalStore } from '@/shared/store/globalStore.ts';
import { useRouter } from 'vue-router';
import {
  authById,
  authByPersonal,
} from '@/features/AccountAuthorization/model';

const props = defineProps<{
  phone: string;
  authMethod: 'id' | 'personal';
  authData: any;
}>();

const emit = defineEmits<{
  (e: 'back'): void;
  (e: 'resend'): void;
}>();

const globalStore = useGlobalStore();

const router = useRouter();
const authStore = useAuthStore();
const smsCode = ref(['', '', '', '']);
const timer = ref(59);
const isTimerActive = ref(true);
const error = ref<string | null>(null);

const numpadMethods = ref<
  { setActiveInput: (input: HTMLInputElement | null) => void } | undefined
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
  smsCode.value = ['', '', '', ''];
  error.value = null;
  emit('back');
};

const submitCode = async () => {
  const codeStr = smsCode.value.join('');
  try {
    const payload = {
      session_id: authStore.sessionId!,
      token_sms: authStore.tokenSms!,
      text_sms: codeStr,
    };

    const response = await checkSMS(payload);

    if (response.result.sms_check === 1) {
      error.value = null;
      document.dispatchEvent(new Event('hideNumpad'));
      authStore.isAuthenticated = true;

      globalStore.setIsLoading(true);
      const userInfo = await getUserInfo();
      const ceid = userInfo.result.ceid;

      const [userStatistics, userStock] = await Promise.all([
        getUserStatistics(ceid),
        getUserStock(ceid),
      ]);

      authStore.setUserData(userInfo.result);
      authStore.setUserStatistics(userStatistics.result);
      authStore.setUserStock(userStock.result);

      globalStore.setIsLoading(false);

      router.push('/cabinet');
    } else {
      error.value = 'Неверный код';
    }
  } catch (err) {
    console.error('Ошибка при проверке SMS:', err);
    error.value = 'Ошибка при проверке кода';
  }
};

const resendCode = async () => {
  if (!isTimerActive.value) {
    try {
      let response;
      if (props.authMethod === 'id') {
        response = await authById(props.authData);
      } else if (props.authMethod === 'personal') {
        response = await authByPersonal(props.authData);
      }
      if (!response || response.result.auth_code !== 1) {
        error.value = 'Ошибка авторизации';
        return;
      }
      authStore.setAuthData(response);
      const payload = {
        session_id: authStore.sessionId!,
        token_sms: authStore.tokenSms!,
      };
      const smsResp = await sendSMS(payload);
      if (smsResp.result.sms_status === 1) {
        timer.value = 59;
        isTimerActive.value = true;
        startTimer();
        smsCode.value = ['', '', '', ''];
        error.value = null;
      } else {
        error.value = 'Ошибка при отправке SMS';
      }
    } catch (err) {
      error.value = 'Ошибка при отправке SMS';
    }
  }
};

watch(smsCode, () => {
  error.value = null;
});

defineExpose({
  setNumpadMethods,
  reset: () => {
    smsCode.value = ['', '', '', ''];
    error.value = null;
    timer.value = 59;
  },
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
}
</style>
