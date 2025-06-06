<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import IconInfo from '@/shared/assets/icons/IconInfo.svg';
import IconQuestion from '@/shared/assets/icons/IconQuestion.svg';
import IconQuit from '@/shared/assets/icons/IconQuit.svg';
import { sendMetrikaGoal } from '@/shared/lib/metrika/sendMetrikaGoal.ts';
import { VButton } from '@/shared/ui';
import { AboutModal, HelpModal } from '@/widgets';
import { useAuthStore } from '@/features/AccountAuthorization/model';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();

const helpModalRef = ref<InstanceType<typeof HelpModal> | null>(null);
const aboutModalRef = ref<InstanceType<typeof AboutModal> | null>(null);

const isHome = computed(() => route.path === '/');

const goHome = () => {
  sendMetrikaGoal('go-main-from-footer');
  authStore.clearAuthData();
  router.push('/');
};

const openHelpModal = () => {
  sendMetrikaGoal('open-help-modal');
  helpModalRef.value?.open();
};

const openAboutModal = () => {
  sendMetrikaGoal('open-about-modal');
  aboutModalRef.value?.open();
};
</script>

<template>
  <footer class="footer">
    <div class="footer__inner container">
      <div class="footer__body">
        <template v-if="!isHome">
          <VButton variant="outline" big @click="openHelpModal">
            <IconQuestion />
            ПОМОЩЬ
          </VButton>
          <VButton variant="primary" big @click="goHome">
            <IconQuit />
            ВЫХОД
          </VButton>
        </template>

        <template v-else>
          <VButton variant="primary" big @click="openAboutModal">
            <IconInfo />
            О компании
          </VButton>
          <VButton variant="primary" big @click="openHelpModal">
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
