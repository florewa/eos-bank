<script setup lang="ts">
import { MainActions } from '@/widgets';
</script>

<template>
  <section class="main">
    <div class="main__inner container">
      <div class="main__body">
        <MainActions />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.main {
  &__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 256px;
  }
}
</style>
