<script setup lang="ts">
import { computed, ref } from 'vue';
import * as Yup from 'yup';
import { authByIdSchema } from '@/shared/validation/validationSchemas';
import { AGREEMENT_TEXT } from '@/features/AccountAuthorization/constants';
import { VButton, VCheckbox, VInput } from '@/shared/ui';

defineProps<{
  openModal: () => void;
}>();

const emit = defineEmits<{
  (e: 'open-agreements-modal', spanText: string): void;
  (e: 'login', phone: string): void;
}>();

const id = ref('');
const birthDate = ref('');
const phone = ref('');
const isAgreementAccepted = ref(false);
const errors = ref<Record<string, string>>({});

const validateField = async (field: string, value: any) => {
  try {
    const schema = Yup.reach(authByIdSchema, field) as Yup.AnySchema;
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

const handleInput = (field: string, value: string | boolean) => {
  validateField(field, value);
};

const handleSubmit = async () => {
  try {
    await authByIdSchema.validate(
      {
        id: id.value,
        birthDate: birthDate.value,
        phone: phone.value,
        isAgreementAccepted: isAgreementAccepted.value,
      },
      { abortEarly: false }
    );
    errors.value = {};
    document.dispatchEvent(new Event('hideKeyboard'));
    emit('login', phone.value);
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
    birthDate.value.trim() !== '' &&
    phone.value.trim() !== '' &&
    isAgreementAccepted.value &&
    Object.keys(errors.value).length === 0
  );
});
</script>

<template>
  <form
    class="account-authorization__form by-id"
    @submit.prevent="handleSubmit"
  >
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
        @input="handleInput('id', id)"
        :error="errors.id"
      />
      <VInput
        class="account-authorization__form-input"
        v-model="birthDate"
        placeholder="Дата рождения"
        v-maska="'##.##.####'"
        @input="handleInput('birthDate', birthDate)"
        :error="errors.birthDate"
      />
      <div class="account-authorization__form-label">Телефон</div>
      <div class="account-authorization__form-label" />
      <VInput
        class="account-authorization__form-input"
        v-model="phone"
        placeholder="Телефон"
        v-maska="'+7 (###) ###-##-##'"
        @input="handleInput('phone', phone)"
        :error="errors.phone"
      />
      <VButton variant="primary" type="submit" :disabled="!isFormValid">
        Войти
      </VButton>
      <VCheckbox
        id="agreement-checkbox"
        v-model="isAgreementAccepted"
        :label="AGREEMENT_TEXT"
        class="agreement-checkbox"
        @span-click="$emit('open-agreements-modal', $event)"
        @update:modelValue="
          handleInput('isAgreementAccepted', isAgreementAccepted)
        "
        :error="errors.isAgreementAccepted"
      />
    </div>
    <div class="account-authorization__text">
      <p>8 (800) 555-17-10</p>
      Звонок по России бесплатный.
    </div>
  </form>
</template>

<style scoped lang="scss">
@use '@/features/AccountAuthorization/ui/AuthFormStyles';
</style>
