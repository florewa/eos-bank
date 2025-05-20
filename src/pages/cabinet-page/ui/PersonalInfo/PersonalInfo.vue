<script setup lang="ts">
import IconPerson from '@/shared/assets/icons/IconPerson.svg';
import IconPhone from '@/shared/assets/icons/IconPhone.svg';
import { useAuthStore } from '@/features/AccountAuthorization/model';

const authStore = useAuthStore();

function formatPhoneNumber(phone: string): string {
  if (!/^\d+$/.test(phone)) {
    return phone;
  }

  let cleanPhone = phone;
  if (phone.startsWith('7') || phone.startsWith('8')) {
    cleanPhone = phone.substring(1);
  }

  if (cleanPhone.length !== 10) {
    return phone;
  }

  return `+7 (${cleanPhone.substring(0, 3)}) ${cleanPhone.substring(3, 6)}-${cleanPhone.substring(6, 8)}-${cleanPhone.substring(8, 10)}`;
}
</script>

<template>
  <section class="personal-info">
    <div class="personal-info__inner">
      <div class="personal-info__title h1">Личные данные</div>
      <div class="personal-info__item text">
        <IconPerson />
        {{ authStore.userData?.fio }}
      </div>
      <div class="personal-info__item text">
        <IconPhone />
        {{ formatPhoneNumber(authStore.userData?.phone || '') }}
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.personal-info {
  &__inner {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__item {
    display: flex;
    gap: 15px;
    align-items: center;

    svg {
      color: var(--red-secondary);
    }
  }
}
</style>
