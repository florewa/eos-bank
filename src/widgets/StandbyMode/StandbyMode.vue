<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import GirlWithCard from '@/shared/assets/img/GirlWithCard2.svg?url';
import GirlWithPaper from '@/shared/assets/img/GirlWithPaper.svg?url';
import logoSrc from '@/shared/assets/img/logo.svg?url';
import { VButton } from '@/shared/ui';

const currentScreen = ref(0);
let intervalId: NodeJS.Timeout | null = null;

const screens = [
  {
    title: 'Избавиться <br /> от долга — легко!',
    subtitle: 'Особенно с хорошими условиями от ЭОС',
    image: GirlWithCard,
    width: 1226,
    height: 1342,
    bottom: -80,
  },
  {
    title: 'Личный кабинет',
    subtitle: 'Простой способ узнать о долге',
    image: GirlWithPaper,
    width: 1226,
    height: 1342,
    bottom: 0,
  },
];

onMounted(() => {
  intervalId = setInterval(() => {
    currentScreen.value = (currentScreen.value + 1) % 2;
  }, 30 * 1000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="standby">
    <div
      class="standby__bg"
      :style="{
        width: `${screens[currentScreen].width}px`,
        height: `${screens[currentScreen].height}px`,
        bottom: `${screens[currentScreen].bottom}px`,
      }"
    >
      <img
        :src="screens[currentScreen].image"
        :class="[
          'standby__girl',
          { 'standby__girl--no-width': currentScreen === 1 },
        ]"
        alt="pic"
      />
    </div>
    <div class="standby__body">
      <div class="standby__header">
        <img :src="logoSrc" alt="logo" width="357" height="128" />
        <div class="standby__title" v-html="screens[currentScreen].title"></div>
        <div class="standby__subtitle">
          {{ screens[currentScreen].subtitle }}
        </div>
      </div>
    </div>
    <div class="standby__action">
      <VButton variant="primary" big>Оплатить</VButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.standby {
  position: absolute;
  inset: 0;
  background-color: var(--background-colors-light-green2);

  &__body {
    padding-top: 80px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 32px;
  }

  &__title {
    font-weight: 700;
    font-size: 88px;
  }

  &__subtitle {
    font-size: 44px;
    text-align: center;
    color: var(--red-secondary);
  }

  &__action {
    position: absolute;
    top: 1350px;
    left: 50%;
    transform: translateX(-50%);

    button {
      padding-inline: 205px;
      font-size: 48px;
    }
  }

  &__bg {
    position: absolute;
    z-index: 0;
    left: 0;
    transition:
      width 0.3s ease-in-out,
      height 0.3s ease-in-out,
      bottom 0.3s ease-in-out;
  }

  &__girl {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: opacity 0.3s ease-in-out;

    &--no-width {
      width: auto;
    }
  }
}
</style>
