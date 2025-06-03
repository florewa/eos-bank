<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import * as Yup from 'yup';

import IconMasterCard from '@/shared/assets/icons/IconMasterCard.svg';
import IconMir from '@/shared/assets/icons/IconMir.svg';
import IconSBP from '@/shared/assets/icons/IconSBP.svg?url';
import IconVisa from '@/shared/assets/icons/IconVisa.svg';
import picSrc from '@/shared/assets/img/GirlWithCard.svg?url';
import { VButton, VInput } from '@/shared/ui';
import { sendMetrikaGoal } from '@/shared/lib/metrika/sendMetrikaGoal.ts';
import { useAuthStore } from '@/features/AccountAuthorization/model';

const router = useRouter();

const selectedPaymentMethod = ref<'card' | 'sbp' | null>(null);
const paymentData = ref<{ sum: string } | null>(null);
const authStore = useAuthStore();
const showMethodError = ref(false);

const showTemporaryError = () => {
  showMethodError.value = true;
  setTimeout(() => {
    showMethodError.value = false;
  }, 3000);
};

const selectMethodAndAllowSubmit = (method: 'card' | 'sbp') => {
  selectedPaymentMethod.value = method;
};

const payDebtSchema = Yup.object({
  sum: Yup.number()
    .typeError('Сумма должна быть числом')
    .positive('Сумма должна быть положительной')
    .min(10, 'Минимальная сумма операции через СПБ составляет 10 рублей')
    .required('Сумма платежа обязательна'),
});

const sum = ref('');
const errors = ref<Record<string, string>>({});

const validateField = async (field: 'sum', value: string) => {
  try {
    const valueToValidate =
      field === 'sum' && value.trim() !== '' ? parseFloat(value) : value;
    const schema = Yup.reach(payDebtSchema, field) as Yup.AnySchema;
    await schema.validate(valueToValidate);
    if (errors.value[field]) {
      delete errors.value[field];
      errors.value = { ...errors.value };
    }
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      errors.value[field] = err.message;
      errors.value = { ...errors.value };
    }
  }
};

const handleSumInput = (value: string) => {
  sum.value = value;
  validateField('sum', value);
};

const handleSubmit = async () => {
  try {
    await payDebtSchema.validate(
      { sum: parseFloat(sum.value) },
      { abortEarly: false }
    );
    errors.value = {};

    if (!selectedPaymentMethod.value) {
      showTemporaryError();
      return;
    }

    if (selectedPaymentMethod.value === 'sbp' && parseFloat(sum.value) < 10) {
      errors.value['sum'] = 'Минимальная сумма для СБП — 10 рублей';
      return;
    }

    paymentData.value = { sum: sum.value };

    await router.push({
      path: '/payment',
      query: {
        method: selectedPaymentMethod.value,
        amount: sum.value,
        clientId: authStore!.userData!.ceid!,
        from: 'cabinet',
      },
    });

    if (selectedPaymentMethod.value === 'sbp') {
      sendMetrikaGoal('pay-debt-sbp');
    }
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      const newErrors: Record<string, string> = {};
      err.inner.forEach((error) => {
        if (error.path) {
          newErrors[error.path] = error.message;
        }
      });
      errors.value = newErrors;
    }
  }
};

const isFormValid = computed(() => {
  const sumAsNumber = parseFloat(sum.value);
  return (
    sum.value.trim() !== '' &&
    !isNaN(sumAsNumber) &&
    sumAsNumber > 0 &&
    Object.keys(errors.value).length === 0
  );
});
</script>

<template>
  <section class="debt-form">
    <div class="debt-form__inner">
      <div class="debt-form__picture">
        <img :src="picSrc" alt="" />
      </div>
      <div class="debt-form__content">
        <h1 class="debt-form__title">Оплата задолженности</h1>
        <div class="debt-form__text text">
          Оплатить задолженность можно банковскими картами платежных систем Мир,
          Visa, MasterCard и через СБП.
        </div>
      </div>
      <form class="debt-form__form" @submit.prevent="handleSubmit">
        <div class="debt-form__form-label">Сумма платежа (руб.)</div>
        <VInput
          type="number"
          :model-value="sum"
          @update:model-value="handleSumInput"
          placeholder="Сумма платежа (руб.)"
          class="debt-form__form-input"
          :error="errors.sum"
        />
        <div v-if="errors.method" class="debt-form__form-error-message">
          {{ errors.method }}
        </div>
        <div class="debt-form__form-actions">
          <VButton
            variant="primary"
            type="submit"
            class="debt-form__button-card"
            :disabled="!isFormValid"
            @click="selectMethodAndAllowSubmit('card')"
          >
            Оплатить картой
            <IconMasterCard />
            <IconVisa />
            <IconMir />
          </VButton>
          <VButton
            variant="outline"
            type="submit"
            class="debt-form__button-sbp"
            :disabled="!isFormValid"
            @click="selectMethodAndAllowSubmit('sbp')"
          >
            Оплатить через СБП
            <img :src="IconSBP" alt="" />
          </VButton>
        </div>
        <div v-if="showMethodError" class="debt-form__form-error-message">
          Пожалуйста, выберите способ оплаты
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped lang="scss">
.debt-form {
  position: relative;

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__picture {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 20px;

    &-label {
      font-weight: 700;
    }

    &-input {
      max-width: 442px;
    }

    &-actions {
      display: flex;
      gap: 20px;
    }

    &-error-message {
      font-weight: 600;
      font-size: 16px;
      display: block;
      color: var(--system-colors-error);
      margin-top: 10px;
      text-align: center;
    }
  }

  &__button-sbp {
    width: 331px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__button-card {
    width: 394px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
}
</style>
