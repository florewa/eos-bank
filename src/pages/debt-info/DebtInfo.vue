<script setup lang="ts">
import { ref } from 'vue';

import { AccountAuthorization, SMSConfirmation } from '@/features';
import DetailCabinet from '@/pages/debt-info/ui/DetailCabinet.vue';

const showSMSCode = ref(false);

const handleLogin = () => {
  showSMSCode.value = true;
};

const handleBack = () => {
  showSMSCode.value = false;
};
</script>

<template>
  <div class="debt-info">
    <DetailCabinet v-show="!showSMSCode" />
    <AccountAuthorization v-show="!showSMSCode" @login="handleLogin" />
    <SMSConfirmation v-show="showSMSCode" @back="handleBack" />
  </div>
</template>

<style scoped lang="scss"></style>
