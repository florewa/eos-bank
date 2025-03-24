<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue?: boolean;
  id?: string;
  label?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  id: '',
  label: '',
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'span-click', spanText: string): void;
}>();

const isChecked = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const handleCheckboxClick = (event: Event) => {
  event.stopPropagation();
  if (!props.disabled) {
    isChecked.value = !isChecked.value;
  }
};

const handleSpanClick = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  const target = event.target as HTMLElement;
  if (target.tagName === 'SPAN') {
    emit('span-click', target.textContent || '');
  }
};

const handleLabelClick = (event: Event) => {
  event.preventDefault();
};
</script>

<template>
  <div
    class="checkbox-wrapper"
    :class="{ 'checkbox-wrapper--disabled': disabled }"
  >
    <label :for="id" class="checkbox-label" @click="handleLabelClick">
      <span
        class="checkbox-custom"
        :class="{ 'checkbox-custom--checked': isChecked }"
        @click="handleCheckboxClick"
      ></span>
      <span
        class="checkbox-text"
        v-if="label"
        v-html="label"
        @click="handleSpanClick"
      ></span>
    </label>
  </div>
</template>

<style scoped lang="scss">
.checkbox-wrapper {
  position: relative;
  display: flex;
  align-items: flex-start;

  &--disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: default;
  user-select: none;
}

.checkbox-custom {
  position: relative;
  border: 2px solid var(--red-third);
  border-radius: 8px;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  transition: all 0.2s ease;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 9px;
    width: 10px;
    height: 20px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  &--checked {
    background-color: var(--red-accent);

    &::after {
      opacity: 1;
    }
  }
}

.checkbox-text {
  font-size: 16px;
  color: var(--red-secondary);

  :deep(span) {
    color: var(--red-accent);
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
