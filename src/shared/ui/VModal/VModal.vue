<script setup lang="ts">
import { defineEmits, defineProps, computed } from 'vue';

const props = withDefaults(
  defineProps<{
    isOpen: boolean;
    fullWidth?: boolean;
    clickOutsideClose?: boolean;
  }>(),
  {
    clickOutsideClose: true,
  }
);

const emit = defineEmits(['close']);

const handleOverlayClick = () => {
  if (props.clickOutsideClose) {
    emit('close');
  }
};

const modalClasses = computed(() => ({
  'modal-content': true,
  'modal-full-width': props.fullWidth,
}));
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
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
  position: relative;
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
