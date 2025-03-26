<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { VButton, VInput } from '@/shared/ui';

import IconBack from '@/shared/assets/icons/IconArrowLeft.svg';

defineEmits<{
  (e: 'back'): void;
}>();

const router = useRouter();
const smsCode = ref('');

const submitCode = () => {
  router.push('/cabinet');
};
</script>

<template>
  <section class="sms-code">
    <div class="sms-code__inner">
      <div class="sms-code__header">
        <VButton variant="primary" @click="$emit('back')">
          <IconBack />
          Назад
        </VButton>
      </div>
      <h1 class="sms-code__title">Введите код из SMS</h1>
      <div class="sms-code__text text">СМС-сообщение отправлено на номер</div>
      <VInput
        v-model="smsCode"
        placeholder="Код из SMS"
        class="sms-code__input"
      />
      <div class="sms-code__buttons">
        <VButton variant="primary" @click="submitCode">Подтвердить</VButton>
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

  &__input {
    margin-bottom: 20px;
  }

  &__buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
  }
}
</style>
