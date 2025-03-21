<script setup lang="ts">
import { ref } from 'vue';
import { VButton, VInput } from '@/shared/ui';

const username = ref<string>('');
</script>

<template>
  <div class="container">
    <VButton variant="primary">primary</VButton>
    <VButton variant="outline">outline</VButton>
    <VInput v-model="username" placeholder="Введите имя" />
    <VInput v-model="username" question placeholder="ID Клиента" />
  </div>
</template>

<style scoped></style>
