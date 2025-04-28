<script setup lang="ts">
import { computed, ref } from 'vue';
import * as Yup from 'yup';
import { authByPersonalSchema } from '@/shared/validation/validationSchemas';
import { AGREEMENT_TEXT } from '@/features/AccountAuthorization/constants';
import { VButton, VCheckbox, VInput } from '@/shared/ui';
import {
  authByPersonal,
  type AuthByPersonalForm,
  useAuthStore,
} from '@/features/AccountAuthorization/model';

defineProps<{
  openModal: () => void;
}>();

const emit = defineEmits<{
  (e: 'open-agreements-modal', spanText: string): void;
  (e: 'login', phone: string): void;
}>();

const form = ref<AuthByPersonalForm>({
  surname: '',
  name: '',
  patronymic: '',
  birthday: '',
  phone: '',
  isAgreementAccepted: false,
});
const errors = ref<Record<string, string>>({});
const authStore = useAuthStore();
const isLoading = ref(false);

const validateField = async (field: keyof AuthByPersonalForm, value: any) => {
  try {
    const schema = Yup.reach(authByPersonalSchema, field) as Yup.AnySchema;
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

const handleInput = (
  field: keyof AuthByPersonalForm,
  value: string | boolean
) => {
  form.value[field] = value as never;
  validateField(field, value);
};

const resetForm = () => {
  form.value = {
    surname: '',
    name: '',
    patronymic: '',
    birthday: '',
    phone: '',
    isAgreementAccepted: false,
  };
  errors.value = {};
};

const handleSubmit = async () => {
  try {
    await authByPersonalSchema.validate(form.value, { abortEarly: false });
    errors.value = {};
    isLoading.value = true;

    const response = await authByPersonal(form.value);
    authStore.setAuthData(response);

    if (response.result.auth_code === 2) {
      alert('Доступ закрыт');
    } else if (response.result.auth_code === 1) {
      emit('login', form.value.phone);
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
    form.value.surname.trim() !== '' &&
    form.value.name.trim() !== '' &&
    form.value.patronymic.trim() !== '' &&
    form.value.birthday.trim() !== '' &&
    form.value.phone.trim() !== '' &&
    form.value.isAgreementAccepted &&
    Object.keys(errors.value).length === 0
  );
});

defineExpose({
  resetForm,
});
</script>

<template>
  <form
    class="account-authorization__form by-personal"
    @submit.prevent="handleSubmit"
  >
    <div class="account-authorization__form-inner">
      <div class="account-authorization__form-label">Фамилия</div>
      <div class="account-authorization__form-label">Имя</div>
      <VInput
        class="account-authorization__form-input"
        v-model="form.surname"
        placeholder="Фамилия"
        @open-modal="openModal"
        @input="handleInput('surname', form.surname)"
        :error="errors.surname"
      />
      <VInput
        class="account-authorization__form-input"
        v-model="form.name"
        placeholder="Имя"
        @input="handleInput('name', form.name)"
        :error="errors.name"
      />
      <div class="account-authorization__form-label">Отчество</div>
      <div class="account-authorization__form-label">Дата рождения</div>
      <VInput
        class="account-authorization__form-input"
        v-model="form.patronymic"
        placeholder="Отчество"
        @input="handleInput('patronymic', form.patronymic)"
        :error="errors.patronymic"
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
