<script setup lang="ts">
import { TheFooter, TheHeader } from '@/widgets';
</script>

<template>
  <div class="main" ref="app">
    <TheHeader />
    <main class="page">
      <slot name="default" />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped lang="scss">
.main {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;

  .page {
    flex: 1 1 auto;
  }
}
</style>
