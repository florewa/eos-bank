<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import IconQuestionInput from '@/shared/assets/icons/IconQuestionInput.svg';

type InputType = 'text' | 'password' | 'email' | 'number';

const props = defineProps<{
  modelValue: string | number;
  type?: InputType;
  placeholder?: string;
  disabled?: boolean;
  question?: boolean;
  error?: string;
}>();

const emit = defineEmits(['update:modelValue', 'open-modal']);

const handleQuestionClick = () => {
  if (props.question) {
    emit('open-modal');
  }
};
</script>

<template>
  <div class="input-wrapper">
    <div class="input-container">
      <input
        :type="props.type || 'text'"
        :value="props.modelValue"
        @input="
          emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :class="{ 'input-error': props.error }"
      />
      <IconQuestionInput
        v-if="props.question"
        class="question-icon"
        @click="handleQuestionClick"
      />
    </div>
    <span v-if="props.error" class="error-message">{{ props.error }}</span>
  </div>
</template>

<style scoped lang="scss">
.input-wrapper {
  width: 100%;
}

.input-container {
  position: relative;
  display: inline-block;
  width: 100%;
}

input {
  background: transparent;
  font-weight: 400;
  font-size: 18px;
  color: var(--red-secondary);
  min-height: 64px;
  border: 2px solid var(--red-third);
  border-radius: 16px;
  padding: 16px 60px 16px 24px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    color: var(--red-primary);
  }

  &.input-error {
    border-color: var(--system-colors-error);
  }
}

.question-icon {
  cursor: pointer;
  color: var(--red-third);
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
}

.error-message {
  font-weight: 600;
  font-size: 16px;
  display: block;
  color: var(--system-colors-error);
  margin-top: 10px;
}
</style>
