<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as Yup from 'yup';

import IconMasterCard from '@/shared/assets/icons/IconMasterCard.svg';
import IconMir from '@/shared/assets/icons/IconMir.svg';
import IconSBP from '@/shared/assets/icons/IconSBP.svg?url';
import IconVisa from '@/shared/assets/icons/IconVisa.svg';
import { sendMetrikaGoal } from '@/shared/lib/metrika/sendMetrikaGoal.ts';
import { VButton, VInput } from '@/shared/ui';
import { IDModal } from '@/widgets';

const router = useRouter();

const selectedPaymentMethod = ref<'card' | 'sbp' | null>(null);
const paymentData = ref<{ id: string; sum: string } | null>(null);

const selectMethodAndAllowSubmit = (method: 'card' | 'sbp') => {
  selectedPaymentMethod.value = method;
};

const payDebtSchema = Yup.object({
  id: Yup.string()
    .min(5, 'ID должен содержать минимум 5 символов')
    .required('ID клиента обязателен'),
  sum: Yup.number()
    .typeError('Сумма должна быть числом')
    .positive('Сумма должна быть положительной')
    .min(10, 'Минимальная сумма операции через СПБ составляет 10 рублей')
    .required('Сумма платежа обязательна'),
});

const id = ref('');
const sum = ref('');
const errors = ref<Record<string, string>>({});
const IDModalRef = ref<InstanceType<typeof IDModal> | null>(null);

const openModal = () => {
  if (IDModalRef.value) {
    IDModalRef.value.open();
  }
};

const validateField = async (field: 'id' | 'sum', value: string) => {
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

const handleIdInput = (value: string) => {
  id.value = value;
  validateField('id', value);
};

const handleSumInput = (value: string) => {
  sum.value = value;
  validateField('sum', value);
};

const handleSubmit = async () => {
  try {
    await payDebtSchema.validate(
      { id: id.value, sum: parseFloat(sum.value) },
      { abortEarly: false }
    );
    errors.value = {};

    if (!selectedPaymentMethod.value) {
      errors.value['method'] = 'Пожалуйста, выберите способ оплаты.';
      return;
    }

    if (selectedPaymentMethod.value === 'sbp' && parseFloat(sum.value) < 10) {
      errors.value['sum'] = 'Минимальная сумма для СБП — 10 рублей';
      return;
    }

    paymentData.value = { id: id.value, sum: sum.value };

    await router.push({
      path: '/payment',
      query: {
        method: selectedPaymentMethod.value,
        amount: sum.value,
        clientId: id.value,
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
    id.value.trim() !== '' &&
    sum.value.trim() !== '' &&
    !isNaN(sumAsNumber) &&
    sumAsNumber > 0 &&
    Object.keys(errors.value).length === 0
  );
});
</script>

<template>
  <section class="pay-debt">
    <div class="pay-debt__inner">
      <div class="pay-debt__header">
        <div class="pay-debt__title h1">
          Оплатить задолженность в терминале — легко!
        </div>
        <div class="pay-debt__text">
          Оплатить задолженность можно банковскими картами платежных систем Мир,
          Visa, MasterCard и через СБП.
        </div>
      </div>
      <div class="pay-debt__badge">
        <div class="pay-debt__list">
          <div class="pay-debt__list-item text">
            До 1 часа — поступление платежа в ЭОС
          </div>
          <div class="pay-debt__list-item text">0% комиссия</div>
          <div class="pay-debt__list-item text">Нужен только ID клиента</div>
        </div>
      </div>
      <form class="pay-debt__form" @submit.prevent="handleSubmit">
        <div class="pay-debt__form-inner">
          <div class="pay-debt__form-label">ID Клиента</div>
          <div class="pay-debt__form-label">Сумма платежа (руб.)</div>
          <VInput
            class="pay-debt__form-input"
            :model-value="id"
            @update:model-value="handleIdInput"
            placeholder="ID Клиента"
            question
            @open-modal="openModal"
            :error="errors.id"
          />
          <VInput
            class="pay-debt__form-input"
            type="number"
            :model-value="sum"
            @update:model-value="handleSumInput"
            placeholder="Сумма платежа (руб.)"
            :error="errors.sum"
          />
          <VButton
            variant="primary"
            type="submit"
            class="pay-debt__button-card"
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
            class="pay-debt__button-sbp"
            :disabled="!isFormValid"
            @click="selectMethodAndAllowSubmit('sbp')"
          >
            Оплатить через СБП
            <img :src="IconSBP" alt="SBP Icon" />
          </VButton>
        </div>
        <div v-if="errors.method" class="pay-debt__form-error-message">
          {{ errors.method }}
        </div>
      </form>
      <IDModal ref="IDModalRef" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.pay-debt {
  &__inner {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__form {
    &-container {
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__badge {
    border-radius: 16px;
    padding: 24px;
    background-color: var(--background-colors-light-green2);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__list-item {
    font-weight: 700;
    display: flex;
    align-items: center;

    &::before {
      content: '';
      display: inline-block;
      width: 8px;
      height: 8px;
      background-color: var(--red-primary);
      border-radius: 50%;
      margin-right: 12px;
    }
  }

  &__form {
    &-inner {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    &-label {
      font-weight: 700;
    }

    &-error-message {
      grid-column: 1 / -1;
      color: var(--red-primary, #d32f2f);
      margin-top: 15px;
      text-align: center;
      font-weight: 500;
    }
  }

  &__button-sbp {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__button-card {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
}
</style>
