<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';

import { AccountAuthorization, SMSConfirmation } from '@/features';
import DetailCabinet from '@/pages/debt-info/ui/DetailCabinet.vue';
import { VNumpad } from '@/shared/ui';

const showSMSCode = ref(false);
const phoneNumber = ref('');
const isNumpadVisible = ref(false);
const numpadRef = ref<InstanceType<typeof VNumpad> | null>(null);
const smsConfirmationRef = ref<SMSConfirmationExposed | null>(null);

const lastAuthMethod = ref<'id' | 'personal' | null>(null);
const lastAuthData = ref<any>(null);

interface SMSConfirmationExposed {
  setNumpadMethods: (methods: {
    setActiveInput: (input: HTMLInputElement | null) => void;
  }) => void;
  reset: () => void;
}

interface LoginPayload {
  phone: string;
  method: 'id' | 'personal';
  data: any;
}

const handleLogin = (payload: LoginPayload) => {
  phoneNumber.value = payload.phone;
  lastAuthMethod.value = payload.method;
  lastAuthData.value = payload.data;
  showSMSCode.value = true;
  nextTick(() => {
    isNumpadVisible.value = true;
    if (smsConfirmationRef.value && numpadRef.value) {
      smsConfirmationRef.value.setNumpadMethods({
        setActiveInput: (input: HTMLInputElement | null) => {
          numpadRef.value?.setActiveInput(input);
        },
      });

      nextTick(() => {
        const firstInput = document.querySelector(
          '.sms-code__input-digit'
        ) as HTMLInputElement;
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
          numpadRef.value?.setActiveInput(firstInput);
        }
      });
    }
  });
};

const handleBack = () => {
  if (smsConfirmationRef.value) {
    smsConfirmationRef.value.reset();
  }
  showSMSCode.value = false;
  isNumpadVisible.value = false;
};

const closeNumpad = () => {
  isNumpadVisible.value = false;
};

watch(showSMSCode, (val) => {
  if (val && smsConfirmationRef.value) {
    smsConfirmationRef.value.reset();
  }
});
</script>

<template>
  <div class="debt-info">
    <DetailCabinet v-show="!showSMSCode" />
    <AccountAuthorization v-show="!showSMSCode" @login="handleLogin" />
    <SMSConfirmation
      ref="smsConfirmationRef"
      v-show="showSMSCode"
      :phone="phoneNumber"
      :auth-method="lastAuthMethod!"
      :auth-data="lastAuthData"
      @back="handleBack"
    />
    <VNumpad
      :is-visible="isNumpadVisible"
      :code="code"
      ref="numpadRef"
      @close="closeNumpad"
    />
  </div>
</template>

<style scoped lang="scss"></style>
