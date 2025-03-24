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
    <input
      :type="props.type || 'text'"
      :value="props.modelValue"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :placeholder="props.placeholder"
      :disabled="props.disabled"
    />
    <IconQuestionInput
      v-if="props.question"
      class="question-icon"
      @click="handleQuestionClick"
    />
  </div>
</template>

<style scoped lang="scss">
.input-wrapper {
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
}

.question-icon {
  cursor: pointer;
  color: var(--red-third);
  position: absolute;
  right: 24px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
}
</style>
