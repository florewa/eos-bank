<script setup lang="ts"></script>

<template>
  <header class="header">
    <div class="header__inner container">
      <div class="header__body">
        <img src="/img/logo.svg" alt="logo" width="179" height="64" />
        <div class="h1">ООО ПКО «ЭОС»</div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  &__body {
    border-radius: 0 0 64px 64px;
    padding: 48px;
    background: var(--white);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  margin-bottom: 40px;
}
</style>
