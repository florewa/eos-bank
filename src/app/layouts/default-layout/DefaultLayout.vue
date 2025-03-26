<script setup lang="ts">
import { VKeyboard } from '@/shared/ui';
import { TheFooter, TheHeader } from '@/widgets';
</script>

<template>
  <div class="main" ref="app">
    <TheHeader />
    <main class="page">
      <div class="container">
        <slot name="default" />
      </div>
    </main>
    <TheFooter />
    <VKeyboard />
  </div>
</template>

<style scoped lang="scss">
.main {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;

  .page {
    flex: 1 1 auto;
  }
}
</style>
