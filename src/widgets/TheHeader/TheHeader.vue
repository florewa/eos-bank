<script setup lang="ts">
import srcLogo from '@/shared/assets/img/logo.svg?url';
</script>

<template>
  <header class="header">
    <div class="header__inner container">
      <div class="header__body">
        <img :src="srcLogo" alt="logo" width="179" height="64" />
        <div class="h1">ООО ПКО «ЭОС»</div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  margin-bottom: 40px;

  &__body {
    border-radius: 0 0 64px 64px;
    padding: 48px;
    background: var(--white);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
