<script setup lang="ts">
import { ref } from 'vue';

import { AGREEMENT_TEXT } from '@/features/AccountAuthorization/constants';
import { VButton, VCheckbox, VInput } from '@/shared/ui';

defineProps<{
  openModal: () => void;
}>();

defineEmits<{
  (e: 'open-agreements-modal', spanText: string): void;
}>();

const id = ref('');
const sum = ref('');
const isAgreementAccepted = ref(false);
</script>

<template>
  <form class="account-authorization__form by-id">
    <div class="account-authorization__form-inner">
      <div class="account-authorization__form-label">
        Идентификационный номер
      </div>
      <div class="account-authorization__form-label">Дата рождения</div>
      <VInput
        class="account-authorization__form-input"
        v-model="id"
        placeholder="Идентификационный номер"
        question
        @open-modal="openModal"
      />
      <VInput
        class="account-authorization__form-input"
        v-model="sum"
        placeholder="Дата рождения"
      />
      <div class="account-authorization__form-label">Телефон</div>
      <div class="account-authorization__form-label" />
      <VInput
        class="account-authorization__form-input"
        v-model="sum"
        placeholder="Телефон"
      />
      <VButton variant="primary">Войти</VButton>
      <VCheckbox
        id="agreement-checkbox"
        v-model="isAgreementAccepted"
        :label="AGREEMENT_TEXT"
        class="agreement-checkbox"
        @span-click="$emit('open-agreements-modal', $event)"
      />
    </div>
    <div class="account-authorization__text">
      <p>8 (800) 555-17-10</p>
      Звонок по России бесплатный.
    </div>
  </form>
</template>

<style scoped lang="scss">
@import '@/features/AccountAuthorization/ui/AuthFormStyles';
</style>
