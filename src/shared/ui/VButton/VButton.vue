<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant: 'primary' | 'outline';
  disabled?: boolean;
  big?: boolean;
  rounded?: boolean;
}

const props = defineProps<Props>();

const buttonClasses = computed(() => ({
  primary: props.variant === 'primary',
  outline: props.variant === 'outline',
  big: props.big,
  rounded: props.rounded,
}));
</script>

<template>
  <button :class="buttonClasses" :disabled="props.disabled">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
button {
  border-radius: 16px;
  padding: 20px;
  font-weight: 700;
  font-size: 18px;
}

.primary {
  border: 2px solid transparent;
  background: var(--red-accent);
  color: var(--white);
}

.outline {
  background: transparent;
  border: 2px solid var(--red-primary);
  color: var(--red-primary);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.big {
  font-size: 32px;
  border-radius: 64px;
  padding: 48px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-wrap: nowrap;

  :deep(svg) {
    width: 64px;
    height: 64px;
  }
}

.rounded {
  border-radius: 40px;
}
</style>
