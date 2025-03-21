<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant: 'primary' | 'outline';
  disabled?: boolean;
}

const props = defineProps<Props>();

const buttonClasses = computed(() => ({
  primary: props.variant === 'primary',
  outline: props.variant === 'outline',
}));
</script>

<template>
  <button :class="buttonClasses" :disabled="props.disabled">
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  border-radius: 16px;
  padding: 20px 36px;
  font-weight: 700;
  font-size: 18px;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.primary {
  border: 2px solid transparent;
  background: var(--red-accent);
  color: var(--white);
}

.outline {
  border: 2px solid var(--red-primary);
  color: var(--red-primary);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
