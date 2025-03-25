<script setup lang="ts">
import IconPerson from '@/shared/assets/icons/IconPerson.svg';
import IconPhone from '@/shared/assets/icons/IconPhone.svg';
</script>

<template>
  <section class="personal-info">
    <div class="personal-info__inner">
      <div class="personal-info__title h1">Личные данные</div>
      <div class="personal-info__item text">
        <IconPerson />
        Константинопольская Александра Александровна
      </div>
      <div class="personal-info__item text">
        <IconPhone />
        +7 (912) 555-35-35
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
