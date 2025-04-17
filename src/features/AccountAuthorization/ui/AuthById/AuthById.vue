<script setup lang="ts">
import { computed, ref } from 'vue';
import * as Yup from 'yup';
import { authByIdSchema } from '@/shared/validation/validationSchemas';
import { AGREEMENT_TEXT } from '@/features/AccountAuthorization/constants';
import { VButton, VCheckbox, VInput } from '@/shared/ui';
import {
  authById,
  type AuthByIdForm,
  useAuthStore,
} from '@/features/AccountAuthorization/model';

defineProps<{
  openModal: () => void;
}>();

const emit = defineEmits<{
  (e: 'open-agreements-modal', spanText: string): void;
  (e: 'login', phone: string): void;
}>();

const form = ref<AuthByIdForm>({
  ceid: '',
  birthday: '',
  phone: '',
  isAgreementAccepted: false,
});
const errors = ref<Record<string, string>>({});
const authStore = useAuthStore();
const isLoading = ref(false);

const validateField = async (field: keyof AuthByIdForm, value: any) => {
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

const handleInput = (field: keyof AuthByIdForm, value: string | boolean) => {
  form.value[field] = value as never; // Обновляем форму
  validateField(field, value);
};

const handleSubmit = async () => {
  console.log('qwe');
  try {
    await authByIdSchema.validate(form.value, { abortEarly: false });
    errors.value = {};
    isLoading.value = true;

    // Предполагаем, что подпись предоставляется где-то (например, с бэкенда)
    const signature = 'YOUR_SIGNATURE_HERE'; // Замените на реальную подпись
    const response = await authById(form.value, signature);
    authStore.setAuthData(response);

    if (response.result.auth_code === 2) {
      alert('Доступ закрыт');
    } else if (response.result.auth_code === 1) {
      emit('login', form.value.phone);
    }
  } catch (err) {
    if (err instanceof Yup.ValidationError) {
      console.log('Validation error:', err);
      const newErrors: Record<string, string> = {};
      err.inner.forEach((error) => {
        if (error.path) {
          newErrors[error.path] = error.message;
        }
      });
      errors.value = newErrors;
    } else {
      authStore.error = 'Ошибка авторизации';
    }
  } finally {
    isLoading.value = false;
    document.dispatchEvent(new Event('hideKeyboard'));
  }
};

const isFormValid = computed(() => {
  return (
    form.value.ceid.trim() !== '' &&
    form.value.birthday.trim() !== '' &&
    form.value.phone.trim() !== '' &&
    form.value.isAgreementAccepted &&
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
        v-model="form.ceid"
        placeholder="Идентификационный номер"
        question
        @open-modal="openModal"
        @input="handleInput('ceid', form.ceid)"
        :error="errors.ceid"
      />
      <VInput
        class="account-authorization__form-input"
        v-model="form.birthday"
        placeholder="Дата рождения"
        v-maska="'##.##.####'"
        @input="handleInput('birthday', form.birthday)"
        :error="errors.birthday"
      />
      <div class="account-authorization__form-label">Телефон</div>
      <div class="account-authorization__form-label" />
      <VInput
        class="account-authorization__form-input"
        v-model="form.phone"
        placeholder="Телефон"
        v-maska="'+7 (###) ###-##-##'"
        @input="handleInput('phone', form.phone)"
        :error="errors.phone"
      />
      <VButton
        variant="primary"
        type="submit"
        :disabled="!isFormValid || isLoading"
      >
        Войти
      </VButton>
      <VCheckbox
        id="agreement-checkbox"
        v-model="form.isAgreementAccepted"
        :label="AGREEMENT_TEXT"
        class="agreement-checkbox"
        @span-click="$emit('open-agreements-modal', $event)"
        @update:modelValue="
          handleInput('isAgreementAccepted', form.isAgreementAccepted)
        "
        :error="errors.isAgreementAccepted"
      />
    </div>
    <div class="account-authorization__form-error" v-if="authStore.error">
      {{ authStore.error }}
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
