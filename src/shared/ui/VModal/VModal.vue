<script setup lang="ts">
import { defineEmits, defineProps, computed } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  fullWidth?: boolean;
}>();

const emit = defineEmits(['close']);

const modalClasses = computed(() => ({
  'modal-content': true,
  'modal-full-width': props.fullWidth,
}));
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click="emit('close')">
        <div :class="modalClasses" @click.stop>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 6;
  padding: 40px;
}

.modal-content {
  max-width: 660px;
  border-radius: 64px;
  padding: 48px;
  background-color: var(--white);
  font-size: 20px;
}

.modal-full-width {
  max-width: 100%;
  padding: 24px;
}
</style>
