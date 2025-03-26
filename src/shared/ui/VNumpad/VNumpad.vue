<script setup lang="ts">
import { nextTick, ref } from 'vue';

import IconBackspace from '@/shared/assets/icons/IconBackspace.svg';
import IconClose from '@/shared/assets/icons/IconClose.svg';
import IconNext from '@/shared/assets/icons/IconNext.svg';
import IconPrev from '@/shared/assets/icons/IconPrev.svg';

defineProps<{
  isVisible: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

const activeInput = ref<HTMLInputElement | null>(null);

const setActiveInput = (input: HTMLInputElement | null) => {
  activeInput.value = input;
};

const handleKeyPress = (key: string) => {
  if (!activeInput.value) return;

  const currentIndex = Array.from(document.querySelectorAll('input')).indexOf(
    activeInput.value
  );

  switch (key) {
    case 'backspace':
      if (activeInput.value.value === '' && currentIndex > 0) {
        const prevInput = document.querySelectorAll('input')[
          currentIndex - 1
        ] as HTMLInputElement;
        prevInput.value = '';
        prevInput.dispatchEvent(new Event('input', { bubbles: true }));
        prevInput.focus();
        activeInput.value = prevInput;
      } else {
        activeInput.value.value = '';
        activeInput.value.dispatchEvent(new Event('input', { bubbles: true }));
      }
      break;
    default:
      if (!activeInput.value.value) {
        activeInput.value.value = key;
        activeInput.value.dispatchEvent(new Event('input', { bubbles: true }));

        if (currentIndex < document.querySelectorAll('input').length - 1) {
          nextTick(() => {
            const nextInput = document.querySelectorAll('input')[
              currentIndex + 1
            ] as HTMLInputElement;
            nextInput.focus();
            nextInput.select();
            activeInput.value = nextInput;
          });
        }
      }
      break;
  }
};

const moveToPrevField = () => {
  const inputs = Array.from(document.querySelectorAll('input'));
  const currentIndex = inputs.indexOf(activeInput.value!);
  if (currentIndex > 0) {
    activeInput.value = inputs[currentIndex - 1] as HTMLInputElement;
    activeInput.value.focus();
  }
};

const moveToNextField = () => {
  const inputs = Array.from(document.querySelectorAll('input'));
  const currentIndex = inputs.indexOf(activeInput.value!);
  if (currentIndex < inputs.length - 1) {
    activeInput.value = inputs[currentIndex + 1] as HTMLInputElement;
    activeInput.value.focus();
  }
};

defineExpose({
  setActiveInput,
});
</script>

<template>
  <section class="numpad" v-if="isVisible">
    <div class="numpad__inner">
      <div class="numpad__wrapper">
        <div class="numpad__content">
          <div class="numpad__actions">
            <div class="numpad__actions-item" @click="moveToPrevField">
              <IconPrev />
              Предыдущее поле
            </div>
            <div class="numpad__actions-item" @click="moveToNextField">
              Следующее поле
              <IconNext />
            </div>
          </div>
          <div class="numpad__body">
            <div class="numpad__buttons">
              <div class="numpad__row">
                <button
                  v-for="key in ['1', '2', '3']"
                  :key="key"
                  class="key"
                  @click="handleKeyPress(key)"
                >
                  {{ key }}
                </button>
              </div>
              <div class="numpad__row">
                <button
                  v-for="key in ['4', '5', '6']"
                  :key="key"
                  class="key"
                  @click="handleKeyPress(key)"
                >
                  {{ key }}
                </button>
              </div>
              <div class="numpad__row">
                <button
                  v-for="key in ['7', '8', '9']"
                  :key="key"
                  class="key"
                  @click="handleKeyPress(key)"
                >
                  {{ key }}
                </button>
              </div>
              <div class="numpad__row last-row">
                <button class="key wide" @click="handleKeyPress('0')">0</button>
                <button
                  class="key backspace"
                  @click="handleKeyPress('backspace')"
                >
                  <IconBackspace />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="numpad__close" @click="$emit('close')">
          <IconClose />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.numpad {
  padding: 28px;
  box-shadow: 0 -8px 32px 0 rgba(0, 29, 32, 0.1);
  background: var(--white);

  &__inner {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 660px;
  }

  &__content {
    border-radius: 36px;
    padding: 24px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__body {
    margin: 0 auto;
    max-width: 328px;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      font-size: 18px;
      color: var(--red-secondary);
    }
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__row {
    display: flex;
    gap: 8px;
    justify-content: center;

    &.last-row {
      justify-content: flex-end;
    }
  }

  &__close {
    margin: 0 auto;
    max-width: 88px;
    border-radius: 16px;
    padding: 17px 33px;
    background: #fafafa;
    text-align: center;
    cursor: pointer;
    color: var(--red-primary);
    font-size: 16px;
  }

  .key {
    border-radius: 8px;
    width: 104px;
    height: 48px;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.3);
    background: var(--white);
    color: var(--red-primary);
    font-size: 18px;
    font-weight: 500;
    border: none;
    cursor: pointer;

    &.backspace {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ebebeb;
    }
  }
}
</style>
