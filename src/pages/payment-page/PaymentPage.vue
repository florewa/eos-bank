<script setup lang="ts">
import { PaymentProcedure } from '@/features';
import { useRoute } from 'vue-router';

const route = useRoute();

const method = route.query.method as 'card' | 'sbp' | undefined;
const amount = route.query.amount as string | undefined;
const clientId = route.query.clientId as string | undefined;
</script>

<template>
  <PaymentProcedure
    :method="method || null"
    :amount="amount || ''"
    :client-id="clientId || ''"
  />
</template>

<style scoped lang="scss"></style>
