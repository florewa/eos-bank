<script setup lang="ts">
import { ref, nextTick } from 'vue';

const props = defineProps<{
  code: string[];
  numpadMethods?: {
    setActiveInput: (input: HTMLInputElement | null) => void;
  };
  error?: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:code', value: string[]): void;
  (e: 'submit'): void;
}>();

const inputs = ref<(HTMLInputElement | null)[]>([]);

const handleInput = (index: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value.replace(/\D/g, '').slice(-1);

  const newCode = [...props.code];
  newCode[index] = value;
  emit('update:code', newCode);

  if (value && index < props.code.length - 1) {
    nextTick(() => {
      inputs.value[index + 1]?.focus();
      inputs.value[index + 1]?.select();
    });
  }

  if (newCode.every((char) => char !== '')) {
    emit('submit');
  }
};

const setActiveInput = (target: EventTarget | null) => {
  if (target instanceof HTMLInputElement && props.numpadMethods) {
    props.numpadMethods.setActiveInput(target);
  }
};

const handleKeydown = (index: number, event: KeyboardEvent) => {
  if (event.key === 'Backspace') {
    if (props.code[index] === '' && index > 0) {
      const prevInput = inputs.value[index - 1];
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    } else {
      const newCode = [...props.code];
      newCode[index] = '';
      emit('update:code', newCode);
    }
  }
};
</script>

<template>
  <div class="sms-code__inputs">
    <input
      v-for="(digit, index) in code"
      :key="index"
      :value="digit"
      type="text"
      maxlength="1"
      class="sms-code__input-digit"
      :class="{ 'sms-code__input-digit--error': error }"
      @input="handleInput(index, $event)"
      @keydown="handleKeydown(index, $event)"
      @focus="setActiveInput($event.target)"
      ref="inputs"
    />
  </div>
  <div v-if="error" class="sms-code__error">{{ error }}</div>
</template>

<style scoped>
.sms-code__inputs {
  display: flex;
  gap: 10px;
  flex-direction: row;
  align-items: center;
}

.sms-code__input-digit {
  width: 70px;
  height: 70px;
  text-align: center;
  font-size: 18px;
  border: 2px solid var(--red-third);
  border-radius: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.sms-code__input-digit:focus {
  border: 2px solid var(--red-primary);
}

.sms-code__input-digit--error {
  border: 2px solid var(--system-colors-error);
}

.sms-code__error {
  color: var(--system-colors-error);
  font-weight: 700;
  font-size: 20px;
}
</style>
