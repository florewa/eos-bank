<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

import IconBackspace from '@/shared/assets/icons/IconBackspace.svg';
import IconClose from '@/shared/assets/icons/IconClose.svg';
import IconNext from '@/shared/assets/icons/IconNext.svg';
import IconPrev from '@/shared/assets/icons/IconPrev.svg';
import IconShift from '@/shared/assets/icons/IconShift.svg';

const isVisible = ref(false);
const activeInput = ref<HTMLInputElement | null>(null);
const isShift = ref(false);

const showKeyboard = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (
    target.tagName === 'INPUT' &&
    !target.classList.contains('sms-code__input-digit')
  ) {
    activeInput.value = target;
    isVisible.value = true;
  }
};

const hideKeyboard = () => {
  isVisible.value = false;
  activeInput.value = null;
};

const handleGlobalHide = () => {
  hideKeyboard();
};

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement;

  if (target.tagName === 'INPUT') return;

  if (target.closest('.keyboard')) return;

  hideKeyboard();
};

const handleKeyPress = (key: string) => {
  if (!activeInput.value) return;

  switch (key) {
    case 'shift':
      isShift.value = !isShift.value;
      break;
    case 'backspace':
      activeInput.value.value = activeInput.value.value.slice(0, -1);
      break;
    case 'Пробел':
      activeInput.value.value += ' ';
      break;
    case 'Ввод':
      const form = activeInput.value.closest('form');
      if (form) {
        form.dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true })
        );
      }
      hideKeyboard();
      break;
    default:
      const char = isShift.value ? key.toUpperCase() : key;
      activeInput.value.value += char;
      if (isShift.value) isShift.value = false;
      break;
  }

  if (activeInput.value) {
    activeInput.value.dispatchEvent(new Event('input', { bubbles: true }));
  }
};

const moveToPrevField = () => {
  if (!activeInput.value) return;
  const inputs = Array.from(document.querySelectorAll('input'));
  const currentIndex = inputs.indexOf(activeInput.value);
  if (currentIndex > 0) {
    activeInput.value = inputs[currentIndex - 1] as HTMLInputElement;
    activeInput.value.focus();
  }
};

const moveToNextField = () => {
  if (!activeInput.value) return;
  const inputs = Array.from(document.querySelectorAll('input'));
  const currentIndex = inputs.indexOf(activeInput.value);
  if (currentIndex < inputs.length - 1) {
    activeInput.value = inputs[currentIndex + 1] as HTMLInputElement;
    activeInput.value.focus();
  }
};

onMounted(() => {
  document.addEventListener('click', showKeyboard);
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('hideKeyboard', handleGlobalHide);
});

onUnmounted(() => {
  document.removeEventListener('click', showKeyboard);
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('hideKeyboard', handleGlobalHide);
});
</script>

<template>
  <transition name="slide">
    <div class="keyboard" v-if="isVisible">
      <div class="keyboard__inner">
        <div class="keyboard__body">
          <div class="keyboard__actions">
            <div class="keyboard__actions-item" @click="moveToPrevField">
              <IconPrev />
              Предыдущее поле
            </div>
            <div class="keyboard__actions-item" @click="moveToNextField">
              Следующее поле
              <IconNext />
            </div>
          </div>
          <div class="keyboard__buttons">
            <div class="keyboard__row">
              <button
                v-for="key in '1234567890'"
                :key="key"
                class="key"
                @click="handleKeyPress(key)"
              >
                {{ key }}
              </button>
            </div>
            <div class="keyboard__row">
              <button
                v-for="key in 'йцукенгшщзхъ'"
                :key="key"
                class="key"
                @click="handleKeyPress(key)"
              >
                {{ isShift ? key.toUpperCase() : key }}
              </button>
            </div>
            <div class="keyboard__row">
              <button
                v-for="key in 'фывапролджэ'"
                :key="key"
                class="key"
                @click="handleKeyPress(key)"
              >
                {{ isShift ? key.toUpperCase() : key }}
              </button>
            </div>
            <div class="keyboard__row">
              <button
                class="key shift"
                :class="{ active: isShift }"
                @click="handleKeyPress('shift')"
              >
                <IconShift />
              </button>
              <button
                v-for="key in 'ячсмитьбю'"
                :key="key"
                class="key"
                @click="handleKeyPress(key)"
              >
                {{ isShift ? key.toUpperCase() : key }}
              </button>
              <button
                class="key backspace"
                @click="handleKeyPress('backspace')"
              >
                <IconBackspace />
              </button>
            </div>
            <div class="keyboard__row last-row">
              <button class="key space" @click="handleKeyPress('Пробел')">
                Пробел
              </button>
              <button class="key enter" @click="handleKeyPress('Ввод')">
                Ввод
              </button>
            </div>
          </div>
        </div>
        <div class="keyboard__close" @click="hideKeyboard">
          <IconClose />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="scss">
.keyboard {
  min-width: 1000px;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 64px;
  box-shadow: 0 -8px 32px 0 rgba(0, 29, 32, 0.1);
  background: var(--white);

  &__inner {
    padding: 28px 40px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__body {
    border-radius: 36px;
    padding: 24px;
    background: #fafafa;
    display: flex;
    flex-direction: column;
    gap: 24px;
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
    border-radius: 24px;
    padding: 16px 32px;
    background: #fafafa;
    align-self: center;
    cursor: pointer;
  }

  .key {
    border-radius: 8px;
    width: 65px;
    height: 48px;
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.3);
    background: var(--white);
    color: var(--red-primary);
    font-size: 18px;
    border: none;
    cursor: pointer;

    &.shift,
    &.backspace {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 103px;
      background: #ebebeb;

      &.active {
        background: #d3d3d3;
      }
    }

    &.space {
      width: 552px;
    }

    &.enter {
      width: 152px;
      background: var(--red-accent);
      color: var(--white);
    }
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
}

.slide-enter-to,
.slide-leave-from {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}
</style>
