<script setup lang="ts">
import { ref, nextTick } from 'vue';

import { AccountAuthorization, SMSConfirmation } from '@/features';
import DetailCabinet from '@/pages/debt-info/ui/DetailCabinet.vue';
import { VNumpad } from '@/shared/ui';

const showSMSCode = ref(false);
const phoneNumber = ref('');
const isNumpadVisible = ref(false);
const numpadRef = ref<InstanceType<typeof VNumpad> | null>(null);
const smsConfirmationRef = ref<SMSConfirmationExposed | null>(null);

interface SMSConfirmationExposed {
  setNumpadMethods: (methods: {
    setActiveInput: (input: HTMLInputElement | null) => void;
  }) => void;
}
const handleLogin = (phone: string) => {
  phoneNumber.value = phone;
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
  showSMSCode.value = false;
  isNumpadVisible.value = false;
};

const closeNumpad = () => {
  isNumpadVisible.value = false;
};
</script>

<template>
  <div class="debt-info">
    <DetailCabinet v-show="!showSMSCode" />
    <AccountAuthorization v-show="!showSMSCode" @login="handleLogin" />
    <SMSConfirmation
      ref="smsConfirmationRef"
      v-show="showSMSCode"
      :phone="phoneNumber"
      @back="handleBack"
    />
    <VNumpad
      :is-visible="isNumpadVisible"
      ref="numpadRef"
      @close="closeNumpad"
    />
  </div>
</template>

<style scoped lang="scss"></style>
