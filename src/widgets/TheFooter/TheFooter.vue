<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import IconInfo from '@/shared/assets/icons/IconInfo.svg';
import IconQuestion from '@/shared/assets/icons/IconQuestion.svg';
import IconQuit from '@/shared/assets/icons/IconQuit.svg';

import { VButton } from '@/shared/ui';
import { AboutModal, HelpModal } from '@/widgets';

const route = useRoute();
const router = useRouter();

const helpModalRef = ref<InstanceType<typeof HelpModal> | null>(null);
const aboutModalRef = ref<InstanceType<typeof AboutModal> | null>(null);

const isHome = computed(() => route.path === '/');

const goHome = () => {
  router.push('/');
};
</script>

<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__body">
        <template v-if="!isHome">
          <VButton variant="outline" big @click="helpModalRef?.open()">
            <IconQuestion />
            ПОМОЩЬ
          </VButton>
          <VButton variant="primary" big @click="goHome">
            <IconQuit />
            ВЫХОД
          </VButton>
        </template>

        <template v-else>
          <VButton variant="primary" big @click="aboutModalRef?.open()">
            <IconInfo />
            О компании
          </VButton>
          <VButton variant="primary" big @click="helpModalRef?.open()">
            <IconQuestion />
            Помощь
          </VButton>
        </template>
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
