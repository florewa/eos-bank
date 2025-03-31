<script setup lang="ts">
import { computed, ref } from 'vue';
import * as Yup from 'yup';
import IconMasterCard from '@/shared/assets/icons/IconMasterCard.svg';
import IconMir from '@/shared/assets/icons/IconMir.svg';
import IconSBP from '@/shared/assets/icons/IconSBP.svg?url';
import IconVisa from '@/shared/assets/icons/IconVisa.svg';
import { VButton, VInput } from '@/shared/ui';
import { IDModal } from '@/widgets';
import { useRouter } from 'vue-router';

const router = useRouter();

const selectedPaymentMethod = ref<'card' | 'sbp' | null>(null);

const selectPaymentMethod = (method: 'card' | 'sbp') => {
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

const openModal = () => {
  if (IDModalRef.value) {
    IDModalRef.value.open();
  }
};

const validateField = async (field: string, value: any) => {
  try {
    const schema = Yup.reach(payDebtSchema, field) as Yup.AnySchema;
    await schema.validate(value);
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

const handleInput = (field: string, value: string) => {
  validateField(field, value);
};

const handleSubmit = async () => {
  try {
    await payDebtSchema.validate(
      { id: id.value, sum: sum.value },
      { abortEarly: false }
    );
    errors.value = {};
    await router.push({
      path: '/payment',
      query: { method: selectedPaymentMethod.value },
    });
    console.log('Оплата:', {
      id: id.value,
      sum: sum.value,
      method: selectedPaymentMethod.value,
    });
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
  return (
    id.value.trim() !== '' &&
    sum.value.trim() !== '' &&
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
            v-model="id"
            placeholder="ID Клиента"
            question
            @open-modal="openModal"
            @input="handleInput('id', id)"
            :error="errors.id"
          />
          <VInput
            class="pay-debt__form-input"
            v-model="sum"
            placeholder="Сумма платежа (руб.)"
            @input="handleInput('sum', sum)"
            :error="errors.sum"
          />
          <VButton
            variant="primary"
            type="submit"
            class="pay-debt__button-card"
            :disabled="!isFormValid"
            @click="selectPaymentMethod('card')"
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
            @click="selectPaymentMethod('sbp')"
          >
            Оплатить через СБП
            <img :src="IconSBP" alt="" />
          </VButton>
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
