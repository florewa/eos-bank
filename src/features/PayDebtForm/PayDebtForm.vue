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
import {
  paymentEvent,
  type PaymentItem,
} from '@/features/PaymentProcedure/model/api.ts';
import { useGlobalStore } from '@/shared/store/globalStore.ts';

const router = useRouter();
const globalStore = useGlobalStore();

const selectedPaymentMethod = ref<'card' | 'sbp' | null>(null);

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
    .required('Сумма платежа обязательна'),
});

const id = ref('');
const sum = ref('');
const errors = ref<Record<string, string>>({});
const IDModalRef = ref<InstanceType<typeof IDModal> | null>(null);

const cardPaymentStatus = ref<'idle' | 'pending' | 'failed'>('idle'); // 'idle', 'pending', 'failed'
const cardPaymentError = ref<string | null>(null);

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
  cardPaymentError.value = null;
  if (selectedPaymentMethod.value === 'card') {
    cardPaymentStatus.value = 'idle';
  }

  try {
    await payDebtSchema.validate(
      { id: id.value, sum: parseFloat(sum.value) },
      { abortEarly: false }
    );
    errors.value = {};

    if (!selectedPaymentMethod.value) {
      console.error('Способ оплаты не выбран перед отправкой формы');
      cardPaymentError.value = 'Пожалуйста, выберите способ оплаты.';
      return;
    }

    if (selectedPaymentMethod.value === 'card') {
      sendMetrikaGoal('pay-debt-card');
      globalStore.setIsLoading(true);
      cardPaymentStatus.value = 'pending';

      const paymentData: PaymentItem[] = [
        {
          title: `Оплата задолженности клиента (${id.value})`,
          count: 1,
          price: parseFloat(sum.value),
        },
      ];

      try {
        const response = await paymentEvent(paymentData);
        if (response.result === 'success') {
          cardPaymentStatus.value = 'idle';
          globalStore.setIsSuccess(true);
          await router.push({
            path: '/payment',
            query: {
              method: 'card',
              result: 'success',
              amount: sum.value,
              clientId: id.value,
            },
          });
        } else {
          cardPaymentStatus.value = 'failed';
          cardPaymentError.value = `Платеж не удался (API: ${response.result}). Попробуйте снова.`;
          globalStore.setIsSuccess(false);
        }
      } catch (error) {
        console.error('Ошибка при вызове paymentEvent:', error);
        cardPaymentStatus.value = 'failed';
        cardPaymentError.value =
          error instanceof Error
            ? error.message
            : 'Произошла неизвестная ошибка при оплате.';
        globalStore.setIsSuccess(false);
      } finally {
        globalStore.setIsLoading(false);
      }
    } else if (selectedPaymentMethod.value === 'sbp') {
      sendMetrikaGoal('pay-debt-sbp');
      await router.push({
        path: '/payment',
        query: {
          method: 'sbp',
          amount: sum.value,
          clientId: id.value,
        },
      });
    }
    // console.log('Оплата:', {
    //   id: id.value,
    //   sum: sum.value,
    //   method: selectedPaymentMethod.value,
    // });
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
    if (cardPaymentStatus.value === 'pending') {
      cardPaymentStatus.value = 'idle';
      globalStore.setIsLoading(false);
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

const isCardPaymentProcessing = computed(
  () => cardPaymentStatus.value === 'pending'
);
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
            :disabled="isCardPaymentProcessing"
          />
          <VInput
            class="pay-debt__form-input"
            type="number"
            :model-value="sum"
            @update:model-value="handleSumInput"
            placeholder="Сумма платежа (руб.)"
            :error="errors.sum"
            :disabled="isCardPaymentProcessing"
          />
          <VButton
            variant="primary"
            type="submit"
            class="pay-debt__button-card"
            :disabled="!isFormValid || isCardPaymentProcessing"
            @click="selectMethodAndAllowSubmit('card')"
          >
            <span
              v-if="isCardPaymentProcessing && selectedPaymentMethod === 'card'"
              >Обработка...</span
            >
            <span v-else>Оплатить картой</span>
            <IconMasterCard />
            <IconVisa />
            <IconMir />
          </VButton>
          <VButton
            variant="outline"
            type="submit"
            class="pay-debt__button-sbp"
            :disabled="!isFormValid || isCardPaymentProcessing"
            @click="selectMethodAndAllowSubmit('sbp')"
          >
            Оплатить через СБП
            <img :src="IconSBP" alt="SBP Icon" />
          </VButton>
        </div>
        <!-- Отображение ошибки платежа картой -->
        <div
          v-if="cardPaymentStatus === 'failed' && cardPaymentError"
          class="pay-debt__form-error-message"
        >
          {{ cardPaymentError }}
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
