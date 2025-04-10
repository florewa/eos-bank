<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';

import { useGlobalStore } from '@/shared/store/globalStore.ts';
import { InactivityModal, VKeyboard } from '@/shared/ui';
import {
  LoaderModal,
  SuccessPaymentModal,
  TheFooter,
  TheHeader,
} from '@/widgets';
import { useInactivity } from '@/shared/lib/hooks/useInactivity.ts';
import StandbyMode from '@/widgets/StandbyMode/StandbyMode.vue';

const globalStore = useGlobalStore();
const LoaderModalRef = ref<InstanceType<typeof LoaderModal> | null>(null);
const SuccessModalRef = ref<InstanceType<typeof SuccessPaymentModal> | null>(
  null
);

watch(
  () => globalStore.isLoading,
  (newValue) => {
    if (LoaderModalRef.value) {
      if (newValue) {
        LoaderModalRef.value.open();
      } else {
        LoaderModalRef.value.close();
      }
    }
  }
);

watch(
  () => globalStore.isSuccess,
  (newValue) => {
    if (SuccessModalRef.value) {
      if (newValue) {
        SuccessModalRef.value.open();
      } else {
        SuccessModalRef.value.close();
      }
    }
  }
);

// onMounted(() => {
//   globalStore.setIsLoading(true);
//   globalStore.setIsSuccess(false);
//
//   setTimeout(() => {
//     globalStore.setIsLoading(false);
//   }, 1500);
//
//   setTimeout(() => {
//     globalStore.setIsSuccess(true);
//   }, 2000);
// });

const modalRef = ref(null);
const isStandby = ref(false);

const exitStandby = () => {
  if (isStandby.value) {
    console.log('[App] Выход из режима ожидания');
    isStandby.value = false;
  }
};

onMounted(() => {
  window.addEventListener('touchstart', exitStandby);
});

onUnmounted(() => {
  window.removeEventListener('touchstart', exitStandby);
});

useInactivity(modalRef, isStandby);
</script>

<template>
  <div class="main" ref="app">
    <TheHeader />
    <main class="page">
      <div class="container">
        <slot name="default" />
      </div>
    </main>
    <TheFooter />
    <VKeyboard />
    <LoaderModal ref="LoaderModalRef" />
    <SuccessPaymentModal ref="SuccessModalRef" />
    <Transition name="fade">
      <StandbyMode v-if="isStandby" />
    </Transition>
    <InactivityModal ref="modalRef" @update:standby="isStandby = $event" />
  </div>
</template>

<style scoped lang="scss">
.main {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  padding-bottom: 40px;

  .page {
    flex: 1 1 auto;
  }
}
</style>
