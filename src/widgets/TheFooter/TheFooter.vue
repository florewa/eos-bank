<script setup lang="ts">
import { ref } from 'vue';

import IconInfo from '@/shared/assets/icons/IconInfo.svg';
import IconQuestion from '@/shared/assets/icons/IconQuestion.svg';
import { VButton } from '@/shared/ui';
import { AboutModal, HelpModal } from '@/widgets';

const helpModalRef = ref<InstanceType<typeof HelpModal> | null>(null);
const aboutModalRef = ref<InstanceType<typeof AboutModal> | null>(null);
</script>

<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__body">
        <VButton variant="primary" big @click="aboutModalRef?.open()">
          <IconInfo />
          О компании
        </VButton>
        <VButton variant="primary" big @click="helpModalRef?.open()">
          <IconQuestion />
          Помощь
        </VButton>
      </div>
    </div>
    <HelpModal ref="helpModalRef" />
    <AboutModal full-width ref="aboutModalRef" />
  </footer>
</template>

<style scoped lang="scss">
.footer {
  &__inner {
    width: 100%;
  }

  &__body {
    flex: 1;
    width: 100%;
    display: flex;
    gap: 20px;

    button {
      width: 100%;
    }
  }
}
</style>
