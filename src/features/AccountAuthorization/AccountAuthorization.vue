<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthById, AuthByPersonal } from '@/features/AccountAuthorization';
import {
  type LoginPayload,
  useAuthStore,
} from '@/features/AccountAuthorization/model';
import { IDModal, AgreementsModal, PolicyModal } from '@/widgets';

defineEmits<{
  (e: 'login', payload: LoginPayload): void;
}>();

const authStore = useAuthStore();
const IDModalRef = ref<InstanceType<typeof IDModal> | null>(null);
const agreementsModalRef = ref<InstanceType<typeof AgreementsModal> | null>(
  null
);
const policyModalRef = ref<InstanceType<typeof PolicyModal> | null>(null);
const activeAuthMethod = ref<'id' | 'personal'>('id');

const authByIdRef = ref<InstanceType<typeof AuthById> | null>(null);
const authByPersonalRef = ref<InstanceType<typeof AuthByPersonal> | null>(null);

const openIDModal = () => {
  if (IDModalRef.value) {
    IDModalRef.value.open();
  }
};

const openModalBySpanText = (spanText: string) => {
  if (spanText.includes('Соглашения')) {
    if (agreementsModalRef.value) {
      agreementsModalRef.value.open();
    }
  } else if (spanText.includes('Политики')) {
    if (policyModalRef.value) {
      policyModalRef.value.open();
    }
  }
};

watch(activeAuthMethod, (newMethod) => {
  if (newMethod === 'id' && authByPersonalRef.value) {
    authByPersonalRef.value.resetForm();
    authStore.error = null;
  } else if (newMethod === 'personal' && authByIdRef.value) {
    authByIdRef.value.resetForm();
    authStore.error = null;
  }
});
</script>

<template>
  <section class="account-authorization">
    <div class="account-authorization_inner">
      <div class="account-authorization__title h1">Авторизация</div>
      <div class="account-authorization__toggle">
        <div
          class="account-authorization__toggle-item"
          :class="{ active: activeAuthMethod === 'id' }"
          @click="activeAuthMethod = 'id'"
        >
          С помощью ID
        </div>
        <div
          class="account-authorization__toggle-item"
          :class="{ active: activeAuthMethod === 'personal' }"
          @click="activeAuthMethod = 'personal'"
        >
          Личные данные
        </div>
      </div>

      <AuthById
        ref="authByIdRef"
        v-show="activeAuthMethod === 'id'"
        :open-modal="openIDModal"
        @open-agreements-modal="openModalBySpanText"
        @login="$emit('login', $event)"
      />
      <AuthByPersonal
        ref="authByPersonalRef"
        v-show="activeAuthMethod === 'personal'"
        :open-modal="openIDModal"
        @open-agreements-modal="openModalBySpanText"
        @login="$emit('login', $event)"
      />
      <IDModal ref="IDModalRef" />
      <AgreementsModal full-width ref="agreementsModalRef" />
      <PolicyModal full-width ref="policyModalRef" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.account-authorization {
  &__inner {
    display: flex;
    flex-direction: column;
    gap: 40px;
  }

  &__toggle {
    margin-block: 40px;
    display: flex;

    &-item {
      position: relative;
      padding: 12px;
      cursor: pointer;
      text-transform: uppercase;
      font-weight: 500;

      &.active {
        color: var(--red-accent);
        font-weight: 500;

        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 2px;
          background-color: var(--red-accent);
        }
      }
    }
  }
}
</style>
